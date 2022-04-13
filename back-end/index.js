require("dotenv").config();
const bcrypt = require("bcrypt");
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
const {json} = require("express");
const uri = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.yiun1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const today = new Date();
const tomorrow = new Date();
// Add 1 Day
tomorrow.setDate(today.getDate() + 2);

async function addUser(user, socket) {
  try {
    await client.connect();

    const result = await client
      .db("safe_speech")
      .collection("users")
      .insertOne(user);

    console.log("username OK");
    socket.emit("ok username");
    console.log(result);
  } catch (e) {
    console.log(e.message);
    if (e.code == 11000) {
      console.log(
        "The userName is a unique index, please add handle of error so that the user knows they need another user name"
      );
      socket.emit("bad username");
    }
  }
}
async function addMessage(userName, message, chatId) {
  try {
    await client.connect();

    const result = await client
        .db("safe_speech")
        .collection("chats").insertOne({

          timeStamp: today,
          content: message,
          from: userName,
          chatId: chatId
        })
    // .insertOne({
    //   messages: [
    //     {
    //       timeStamp: today,
    //       content: "This is a message",
    //       from: "AnoterUserName",
    //     },
    //     {
    //       timeStamp: tomorrow,
    //       content: "This is a message",
    //       from: "TestUsername",
    //     },
    //   ],
    //   title: "Example title",
    //   members: ["AnoterUserName", "TestUsername"],
    //   lastUpdated: today,
    // });

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
async function checkUsernameExists(user, socket) {
  try {
    console.log("checking " + user);
    await client.connect();
    addUser(user, socket);
  } catch (e) {
    console.log(e.message);
  } finally {
    //await client.close();
  }
}
async function checkLoginCredentials(user, socket) {
  try {
    await client.connect();
    let query = { userName: user.userName };
    const result = await client
      .db("safe_speech")
      .collection("users")
      .findOne(query);

    console.log("query is:");
    console.log(query);
    console.log("result is:");
    console.log(result);

    if (result == undefined) {
      socket.emit("bad credentials");
    } else {
      /*let hash = result.password;
      bcrypt.compare(saltedHash, hash, function (err, result) {
        if (result) {
          socket.emit("login ok", result[0]);
        } else {
          socket.emit("bad credentials");
        }
      });*/

      if (
        result.password == user.password &&
        result.userName == user.userName
      ) {
        socket.emit("login ok", result[0]);
      } else {
        socket.emit("bad credentials");
      }
    }
  } catch (e) {
    console.log(e.message);
  } finally {
    //await client.close();
  }
}
async function createChat(chatTitle, messages, participants){
  try {
    await client.connect();
    const result = await client
        .db("safe_speech")
        .collection("chats").insertOne({
          chatTitle: chatTitle,
          messages: messages,
          participants: participants
        })
    console.log(result);
  } catch (e) {
    console.log(e.message);
    if (e.code === 11000) {
      console.log(
          "The userName is a unique index, please add handle of error so that the user knows they need another user name"
      );
    }
  } finally {
    await client.close();
  }
}

async function getChats(username){
  await client.connect();
  let query = {participants: {username: username}};
  const cursor = await client
      .db("safe_speech")
      .collection("chats")
      .find(query);
  return await cursor.toArray();
}

io.on("connection", (socket) => {
  console.log("Connection started");
  // TODO add user to all relevant rooms
  socket.on("message", (obj) => {
    console.log(obj);
    // TODO save message into DB
    addMessage(obj.from, obj.content, obj.chatId)
    // TODO send message to all users in the room
    io.emit("message", obj);
    // io.to(socket.id).emit("message", obj);
  });

  socket.on("get chats", async (userName) => {
    io.to(socket.id).emit("user chats", await getChats(userName));
  });
  socket.on("create chat", async (chatTitle, messages, users) => {
    await createChat(chatTitle, messages, users);
  })

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

  socket.on("check new login", function (credentials) {
    console.log(credentials);
    checkUsernameExists(credentials, socket);
  });

  socket.on("check login credentials", (credentials) => {
    //login
    checkLoginCredentials(credentials, socket);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

//TESTS
//
// createChat("Test", [
//   {content: "message1", username: "charlie", timestamp: today},
//   {content: "message2", username: "bob", timestamp: tomorrow},
// ], [{username: "charlie"}, {username: "bob"}])
//
// console.log(getChats("bob"));