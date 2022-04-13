require("dotenv").config();
/*

 */

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
let userSocketIds = new Map();
const { MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const {json} = require("express");
const uri = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.yiun1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

/**/
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
  }
}
async function getUser(username){
  await client.connect();
  let query = { username: username };
  return await client
      .db("safe_speech")
      .collection("users")
      .findOne(query);
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
  } finally {
    await client.close();
  }
}

async function getUserChats(username){
  await client.connect();
  let query = {participants: {username: username}};
  const cursor = await client
      .db("safe_speech")
      .collection("chats")
      .find(query);
  return await cursor.toArray();
}
async function getChat(chatId){
  await client.connect();
  let query = {_id: chatId};
  return await client
      .db("safe_speech")
      .collection("chats")
      .findOne(query);
}
async function addMessageToChat(content, sender, chatId){
  try {
    await client.connect();
    const result = await client
        .db("safe_speech")
        .collection("chats").updateOne(
            {_id: chatId},
            { "$push": {messages: {content:content, username:sender, timestamp:new Date()} }}
        );
    console.log(result);
  } catch (e) {
    console.log(e.message);
  } finally {
    await client.close();
  }
}

io.on("connection", (socket) => {
  console.log("Connection started");
  // TODO on disconnect remove socket from map
  socket.on("get user", async (username) => {
    io.to(socket.id).emit("user info", await getUser(username));
  });
  socket.on("get chats", async (userName) => {
    io.to(socket.id).emit("user chats", await getUserChats(userName));
  });
  socket.on("create chat", async (chatTitle, messages, users) => {
    await createChat(chatTitle, messages, users);
  })
  socket.on("add message to chat", async (content, sender, chatId) => {
    // assuming you get just the string otherwise ObjectId not necessary
    await addMessageToChat(content, sender, ObjectId(chatId));
    // send message to all participants
    const chat = getChat(ObjectId(chatId));
    const users = chat.participants;
    users.forEach((user)=>{
      let socketId = userSocketIds.get(user.username);
      if(socketId){
        io.to(socketId).emit("message", content)
      }
    });
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
  socket.on("logged in", (username) => {userSocketIds.set(username, socket.id);})
  socket.on("register user", async (credentials) => {
    const user = await getUser(credentials.username);
    if (user){
      console.log("Found a user with username");
      io.to(socket.id).emit("bad username");
    } else{
      console.log("good");
      io.to(socket.id).emit("ok username");
      // add to db
      await addUser(credentials);
      userSocketIds.set(credentials.username, socket.id);
    }
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

//TESTS
//const today = new Date();
// const tomorrow = new Date();
// // Add 1 Day
// tomorrow.setDate(today.getDate() + 2);
// createChat("Test", [
//   {content: "message1", username: "charlie", timestamp: today},
//   {content: "message2", username: "bob", timestamp: tomorrow},
// ], [{username: "charlie"}, {username: "bob"}])
//
// console.log(getChats("bob"));
//
// addMessageToChat("Message 3", "bob", ObjectId("6256227058e97bee48b8c1cf"));
//
// console.log(getUser("a"));
