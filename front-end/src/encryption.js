let private_key_object = null;
let public_key_object = null;
let promise_key = null;
let encrypted_data = null;
let encrypt_promise = null;
let decrypt_promise = null;
let decrypted_data = null;
let crypto = window.crypto || window.msCrypto;
let vector = crypto.getRandomValues(new Uint8Array(16));

function convertStringToArrayBufferView(str) {
  let bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

function convertArrayBufferViewtoString(buffer) {
  let str = "";
  for (let iii = 0; iii < buffer.byteLength; iii++) {
    str += String.fromCharCode(buffer[iii]);
  }
  return str;
}

function decrypt_data() {
  decrypt_promise = crypto.subtle.decrypt(
    { name: "RSA-OAEP", iv: vector },
    private_key_object,
    encrypted_data
  );

  decrypt_promise.then(
    function (result) {
      decrypted_data = new Uint8Array(result);
      console.log(convertArrayBufferViewtoString(decrypted_data));
    },
    function (e) {
      console.log(e.message);
    }
  );
}
function encrypt_data(data) {
  encrypt_promise = crypto.subtle.encrypt(
    { name: "RSA-OAEP", iv: vector },
    public_key_object,
    convertStringToArrayBufferView(data)
  );

  encrypt_promise.then(
    function (result) {
      encrypted_data = new Uint8Array(result);

      decrypt_data();
    },
    function (e) {
      console.log(e.message);
    }
  );
}
function example() {
  let data = "A message";
  if (crypto.subtle) {
    alert("Cryptography API Supported");

    promise_key = crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-256" },
      },
      false,
      ["encrypt", "decrypt"]
    );

    promise_key.then(function (key) {
      private_key_object = key.privateKey;
      public_key_object = key.publicKey;
      encrypt_data(data);
    });

    promise_key.catch = function (e) {
      console.log(e.message);
    };
  } else {
    alert("Cryptography API not Supported");
  }
}
example();
