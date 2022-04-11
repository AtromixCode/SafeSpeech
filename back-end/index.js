require("dotenv").config();
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const port = 8000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.yiun1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function addUser(user) {
  try {
    await client.connect();

    const result = await client
      .db("safe_speech")
      .collection("users")
      .insertOne(user);

    console.log(result);
  } catch (e) {
    console.log(e.message);
    if (e.code == 11000) {
      console.log(
        "The userName is a unique index, please add handle of error so that the user knows they need another user name"
      );
    }
  } finally {
    await client.close();
  }
}

addUser({
  userName: "TestUser",
  password: "Gibberish",
});

io.on("connection", (socket) => {
  console.log("Connection started");

  socket.on("message", (data) => {
    console.log(data);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
