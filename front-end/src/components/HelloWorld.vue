<template>
  <div><b-button @click="sendMessage">Something</b-button></div>
</template>

<script>
let pubKey = null;
let privKey = null;
const user = "JD";
const encAlgo = "RSA-OAEP";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    async sendMessage() {
      console.log("SEND MESSAGE");
      const msg = "A message";
      console.log(msg);
      if (!privKey) {
        console.log("GENERATING KEY");
        let keys = await window.crypto.subtle.generateKey(
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
        pubKey = keys.publicKey;
        privKey = keys.privateKey;
        let pubKeyObj = {
          user: user,
          key: await window.crypto.subtle.exportKey("jwk", pubKey),
        };
        console.log(pubKeyObj);
        this.$socket.emit("pubkey", pubKeyObj);
        console.log("FINISHED GENERATING KEY");
      }
      console.log("ENCRYPTING AND SENDING MESSAGE");
      const rval = await encrypt(msg, pubKey);
      // console.log(rval.iv);
      // console.log(rval.encryptedData);

      const encMsgObj = {
        encryptedMsg: pack(rval.encryptedData),
        iv: pack(rval.iv),
      };
      console.log(encMsgObj);
      this.$socket.emit("message", encMsgObj);
    },
  },
  mounted() {
    this.$socket.on("message", async (obj) => {
      console.log("RECEIVED MSG");
      console.log(obj);
      const final = await decrypt(
        unpack(obj.encryptedMsg),
        privKey,
        unpack(obj.iv)
      );
      console.log(final);
    });
  },
};

// let key = null;
// async function createKey() {
//
// }
// createKey();
const encode = (data) => {
  const encoder = new TextEncoder();
  return encoder.encode(data);
};
const generateIv = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
  return window.crypto.getRandomValues(new Uint8Array(16));
};
const encrypt = async (data, key) => {
  // console.log("ENCRYPT, data, key, encoded, iv, encrypted data, rval");
  // console.log(data);
  // console.log(key);
  const encoded = encode(data);
  const iv = generateIv();
  // console.log(encoded);
  // console.log(iv);
  const encryptedData = await window.crypto.subtle.encrypt(
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
  const encoded = await window.crypto.subtle.decrypt(
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
