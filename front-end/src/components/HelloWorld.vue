<template>
  <div><b-button @click="sendMessage">Something</b-button></div>
</template>

<script>
let key = null;
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
      key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );
      console.log(key);
      const rval = await encrypt(msg, key);
      console.log(rval.iv);
      console.log(rval.encryptedData);

      const obj = {
        encryptedMsg: pack(rval.encryptedData),
        iv: pack(rval.iv),
      };
      console.log(obj);
      this.$socket.emit("message", obj);
    },
  },
  mounted() {
    this.$socket.on("message", async (obj) => {
      console.log("RECEIVED MSG");
      console.log(obj);
      const final = await decrypt(
        unpack(obj.encryptedMsg),
        key,
        unpack(obj.iv)
      );
      console.log(final);
    });
  },
};
const generateKey = () => {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
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
      name: "AES-GCM",
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
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedData
  );
  return decode(encoded);
};
const app = async () => {
  // encrypt message
  const first = "Hello, World!";
  console.log(first);
  const key = await generateKey();
  console.log(key);
  const rval = await encrypt(first, key);
  console.log(rval.iv);
  console.log(rval.encryptedData);

  const response = {
    cipher: pack(rval.encryptedData),
    iv: pack(rval.iv),
  };

  // unpack and decrypt message
  const final = await decrypt(
    unpack(response.cipher),
    key,
    unpack(response.iv)
  );
  console.log(final); // logs 'Hello, World!'
};
app();
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
