const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const port = 8000;

io.on("connection", (socket) => {
  console.log("Connection started");

  socket.on("message", (data) => {
    console.log(data);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
