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
  socket.on("pubkey", (obj)=>{
    console.log(obj);
    userKeys.set(obj.user, obj.key);
    console.log(userKeys.get(obj.user));
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
