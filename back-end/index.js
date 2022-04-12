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
let userKeys = new Map();
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
const today = new Date();
const tomorrow = new Date();

// Add 1 Day
tomorrow.setDate(today.getDate() + 2);

async function addMessage(userName, message) {
  try {
    await client.connect();

    const result = await client
      .db("safe_speech")
      .collection("chats")
      .insertOne({
        messages: [
          {
            timeStamp: today,
            content: "This is a message",
            from: "AnoterUserName",
          },
          {
            timeStamp: tomorrow,
            content: "This is a message",
            from: "TestUsername",
          },
        ],
        title: "Example title",
        members: ["AnoterUserName", "TestUsername"],
        lastUpdated: today,
      });

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

addMessage("TestUsername", {
  timeStamp: tomorrow,
  content: "This is a future message",
  from: "AnoterUserName",
});

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
