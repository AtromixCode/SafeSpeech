const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const port = 8000;
let userKeys = new Map();
io.on("connection", (socket) => {
  console.log("Connection started");

  socket.on("message", (obj) => {
    console.log(obj);
    io.to(socket.id).emit("message", obj);
  });
  socket.on("set pubkey", (obj)=>{
    console.log(obj);
    userKeys.set(obj.user, obj.key);
    console.log(userKeys.get(obj.user));
  });
  socket.on("get pubkey", (obj)=>{
    console.log("Pub key request for "+obj.user);
    let pubKey = {user: obj.user, pubKey: userKeys.get(obj.user)};
    console.log(pubKey);
    io.to(socket.id).emit("pubkey", pubKey);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
