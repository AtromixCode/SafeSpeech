<template>
  <div><b-button @click="sendMessage">Something</b-button></div>
</template>

<script>
let userPubKeys = new Map();
let publicKey = null;
let privateKey = null;
const user = "JD";
const encAlgo = "RSA-OAEP";
let crypto = window.crypto || window.msCrypto;
if (!crypto.subtle) {
  alert("Cryptography API not Supported");
}
let db = null;
function getDB() {
  return new Promise(function (resolve) {
    let indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;

    if (!indexedDB) {
      window.alert(
        "Your browser doesn't support a stable version of IndexedDB."
      );
    }
    let open = indexedDB.open("SafeSpeechDB", 1);

    open.onerror = function (event) {
      console.log("error: " + event);
    };

    open.onsuccess = function (event) {
      console.log(event);
      db = open.result;
      console.log("success: " + db);
      return resolve();
    };

    open.onupgradeneeded = function (event) {
      let db = event.target.result;
      db.createObjectStore("keys", { keyPath: "id" });
    };
  });
}
function getKey(name) {
  return new Promise((resolve) => {
    let request = db.transaction(["keys"]).objectStore("keys").get(name);

    request.onerror = function (event) {
      console.log(event);
      console.log("Unable to retrieve data from database!");
    };

    request.onsuccess = function (event) {
      console.log(event);
      if (request.result) {
        console.log("Restored key from DB");
        return resolve(request.result.ar);
      } else {
        console.log("Could not retrieve the private key");
      }
    };
  });
}
getDB().then(() => {
  getKey("privateKey").then((privKey) => {
    privateKey = privKey;
    console.log(privateKey);
  });
});

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    async sendMessage() {
      console.log("SEND MESSAGE");
      console.log(privateKey);
      const msg = "A message";
      console.log(msg);
      if (!privateKey) {
        console.log("No private key, trying to find one");
        privateKey = await getKey();
      }
      if (!privateKey) {
        await this.generateKey();
      }
      console.log("ENCRYPTING AND SENDING MESSAGE");
      const rval = await encrypt(msg, publicKey);
      // console.log(rval.iv);
      // console.log(rval.encryptedData);

      const encMsgObj = {
        encryptedMsg: pack(rval.encryptedData),
        iv: pack(rval.iv),
      };
      console.log(encMsgObj);
      this.$socket.emit("message", encMsgObj);
    },
    async generateKey() {
      console.log("No key, GENERATING KEY");
      let keys = await crypto.subtle.generateKey(
        {
          name: encAlgo,
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: { name: "SHA-256" },
        },
        false,
        ["encrypt", "decrypt"]
      );
      console.log(keys);
      publicKey = keys.publicKey;
      privateKey = keys.privateKey;

      console.log("Adding private key to IndexedDB");
      let request = db
        .transaction(["keys"], "readwrite")
        .objectStore("keys")
        .add({
          id: "privateKey",
          ar: privateKey,
        });
      request.onsuccess = function (event) {
        console.log(event);
        console.log("Added private key to DB");
      };
      request.onerror = function (event) {
        console.log(event);
        console.log("Could not Add private key to DB");
      };

      let pubKeyObj = {
        user: user,
        key: await crypto.subtle.exportKey("jwk", publicKey),
      };
      console.log(pubKeyObj);
      this.$socket.emit("set pubkey", pubKeyObj);
      userPubKeys.set(user, publicKey);
      console.log("FINISHED GENERATING KEY");
    },
  },
  mounted() {
    this.$socket.on("message", async (obj) => {
      console.log("RECEIVED MSG");
      console.log(obj);
      const final = await decrypt(
        unpack(obj.encryptedMsg),
        privateKey,
        unpack(obj.iv)
      );
      console.log(final);
    });
    this.$socket.on("pubkey", async (obj) => {
      console.log("received pubkey");
      console.log(obj);
      publicKey = obj.pubKey;
      if (publicKey) {
        console.log("pubkey valid");
        console.log(publicKey);
        userPubKeys.set(user, publicKey);
      } else {
        console.log("no pubkey, generating");
        await this.generateKey();
      }
    });
  },
  created() {
    const request = { user: user };
    this.$socket.emit("get pubkey", request);
  },
};

const encode = (data) => {
  const encoder = new TextEncoder();
  return encoder.encode(data);
};
const generateIv = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
  return crypto.getRandomValues(new Uint8Array(16));
};
const encrypt = async (data, key) => {
  console.log("ENCRYPT, data, key, encoded, iv, encrypted data, rval");
  console.log(data);
  console.log(key);
  const encoded = encode(data);
  const iv = generateIv();
  console.log(encoded);
  console.log(iv);
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: encAlgo,
      iv: iv,
    },
    key,
    encoded
  );
  // console.log(encryptedData);
  const rval = {
    encryptedData: encryptedData,
    iv: iv,
  };
  // console.log(rval);
  return rval;
};
const pack = (buffer) => {
  return window.btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
};
const unpack = (packed) => {
  const string = window.atob(packed);
  const buffer = new ArrayBuffer(string.length);
  const bufferView = new Uint8Array(buffer);

  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i);
  }

  return buffer;
};
const decode = (bytestream) => {
  const decoder = new TextDecoder();
  return decoder.decode(bytestream);
};
const decrypt = async (encryptedData, key, iv) => {
  const encoded = await crypto.subtle.decrypt(
    {
      name: encAlgo,
      iv: iv,
    },
    key,
    encryptedData
  );
  return decode(encoded);
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
