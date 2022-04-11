<template>
  <div><b-button @click="sendMessage">Something</b-button></div>
</template>

<script>
let userPubKeys = new Map();
let publicKey = null;
let privateKey = null;
const user = "JD";
const encAlgo = "RSA-OAEP";
const keyExportFormat = "jwk";
const hashFunc = "SHA-256";
let crypto = window.crypto || window.msCrypto;
if (!crypto.subtle) {
  alert("Cryptography API not Supported");
}
let db = null;

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
        privateKey = await this.getKey("privateKey");
        publicKey = await this.getKey("publicKey");
      }
      if (!privateKey) {
        await this.generateKey();
      }
      console.log("ENCRYPTING AND SENDING MESSAGE");
      const rval = await this.encrypt(msg, publicKey);
      // console.log(rval.iv);
      // console.log(rval.encryptedData);

      const encMsgObj = {
        encryptedMsg: this.pack(rval.encryptedData),
        iv: this.pack(rval.iv),
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
          hash: { name: hashFunc },
        },
        false,
        ["encrypt", "decrypt"]
      );
      console.log(keys);
      publicKey = keys.publicKey;
      privateKey = keys.privateKey;
      await this.updateKey(publicKey, "publicKey");
      await this.updateKey(privateKey, "privateKey");
      let pubKeyObj = {
        user: user,
        key: await crypto.subtle.exportKey(keyExportFormat, publicKey),
      };
      console.log(pubKeyObj);
      this.$socket.emit("set pubkey", pubKeyObj);
      userPubKeys.set(user, publicKey);
      console.log("FINISHED GENERATING KEY");
    },
    encode(data) {
      const encoder = new TextEncoder();
      return encoder.encode(data);
    },
    generateIv() {
      // https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
      return crypto.getRandomValues(new Uint8Array(16));
    },
    async encrypt(data, key) {
      console.log("ENCRYPT, data, key, encoded, iv, encrypted data, rval");
      console.log(data);
      console.log(key);
      const encoded = this.encode(data);
      const iv = this.generateIv();
      // console.log(encoded);
      // console.log(iv);
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: encAlgo,
          iv: iv,
        },
        key,
        encoded
      );
      return {
        encryptedData: encryptedData,
        iv: iv,
      };
    },
    pack(buffer) {
      return window.btoa(
        String.fromCharCode.apply(null, new Uint8Array(buffer))
      );
    },
    decode(bytestream) {
      const decoder = new TextDecoder();
      return decoder.decode(bytestream);
    },
    async decrypt(encryptedData, key, iv) {
      const encoded = await crypto.subtle.decrypt(
        {
          name: encAlgo,
          iv: iv,
        },
        key,
        encryptedData
      );
      return this.decode(encoded);
    },
    addKey(key, keyName) {
      console.log("Adding key " + keyName + " to IndexedDB");
      let request = db
        .transaction(["keys"], "readwrite")
        .objectStore("keys")
        .add({
          id: keyName,
          ar: key,
        });
      request.onsuccess = function (event) {
        console.log(event);
        console.log("Added key to DB");
      };
      request.onerror = function (event) {
        console.log(event);
        console.log("Could not add key to DB");
      };
    },
    getDB() {
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

        open.onsuccess = function () {
          db = open.result;
          return resolve();
        };

        open.onupgradeneeded = function (event) {
          let db = event.target.result;
          db.createObjectStore("keys", { keyPath: "id" });
        };
      });
    },
    getKey(name) {
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
    },
    removeKey(name) {
      return new Promise(() => {
        let request = db
          .transaction(["keys"], "readwrite")
          .objectStore("keys")
          .delete(name);
        request.onerror = function () {
          console.log("Unable to remove key from database!");
        };
        request.onsuccess = function () {
          console.log("Removed key");
        };
      });
    },
    updateKey(newVal, name) {
      return new Promise(() => {
        console.log("Updating key");
        console.log(name);
        console.log(newVal);
        let request = db
          .transaction(["keys"], "readwrite")
          .objectStore("keys")
          .put({
            id: name,
            ar: newVal,
          });
        request.onerror = function () {
          console.log("Unable to update key in database!");
        };
        request.onsuccess = function () {
          console.log("updated key in indexeddb");
        };
      });
    },
  },
  mounted() {
    this.$socket.on("message", async (obj) => {
      console.log("RECEIVED MSG");
      console.log(obj);
      const final = await this.decrypt(
        unpack(obj.encryptedMsg),
        privateKey,
        unpack(obj.iv)
      );
      console.log(final);
    });
    this.$socket.on("pubkey", async (obj) => {
      console.log("received pubkey");
      console.log(obj.pubKey);
      if (window.publicKey) {
        console.log("imported public key");
        publicKey = await crypto.subtle.importKey(
          keyExportFormat,
          obj.pubKey,
          {
            name: encAlgo,
            hash: hashFunc,
          },
          true,
          ["encrypt"]
        );
        console.log(publicKey);
        userPubKeys.set(user, publicKey);
      } else {
        await this.generateKey();
      }
    });
  },
  created() {
    const request = { user: user };
    this.$socket.emit("get pubkey", request);
    this.getDB().then(() => {
      this.getKey("publicKey").then((pk) => {
        publicKey = pk;
      });
      this.getKey("privateKey").then((pk) => {
        privateKey = pk;
      });
    });
  },
};
function unpack(packed) {
  const string = window.atob(packed);
  const buffer = new ArrayBuffer(string.length);
  const bufferView = new Uint8Array(buffer);

  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i);
  }

  return buffer;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
