require("dotenv").config();
/**
 * Main server file, allows interaction with the MongoDB with credentials in the .env file.
 * Handles communicating to the children and handling talking between the children.
 *
 * MongoDB specs:
 *  users collection:
 *    username: "" // unique key
 *    password: ""
 *    ... other data
 *  chats collection:
 *    chatTitle: ""
 *    messages: [...{content: "", username: "", timestamp: Date}]
 *    participants: [...{username: "", ...other info}]
 *
 * Author(s):
 * Victor Sanchez
 * Jean-David Rousseau
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
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { json } = require("express");
const uri = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.yiun1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

/**
 * Adds a user to the database.
 * user: {username: "", password: "", ..other info}
 */
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

/**
 * Adds a chat to the DB.
 * @param chatTitle: name of the chat
 * @param messages: list of messages in the chat, in [...{content: "", username: "", timestamp: Date}] format
 * @param participants: list of participants in the chat, in user format (passwords omitted)
 * @returns nothing
 */
async function createChat(chatTitle, messages, participants) {
  try {
    await client.connect();
    const result = await client
      .db("safe_speech")
      .collection("chats")
      .insertOne({
        chatTitle: chatTitle,
        messages: messages,
        participants: participants,
      });
    console.log(result.insertedId.toString());
    return result.insertedId.toString();
  } catch (e) {
    console.log(e.message);
  } finally {
    await client.close();
  }
}

/**
 * Adds a message to the specified chat.
 * @param content the message's text
 * @param sender the username of the user who sent it
 * @param chatId the chat ID to which this message will be appended
 * @returns nothing.
 */
async function addMessageToChat(msgPayload, chatId) {
  try {
    await client.connect();
    const result = await client
      .db("safe_speech")
      .collection("chats")
      .updateOne({ _id: chatId }, { $push: { messages: msgPayload } });
    console.log(result);
  } catch (e) {
    console.log(e.message);
  } finally {
    await client.close();
  }
}

/**
 * Gets a user object with the username provided.
 * @param username the username to query for.
 * @returns {Promise<Document & {_id: InferIdType<Document>}>} that represents the user, or null.
 */
async function getUser(username) {
  await client.connect();
  let query = { username: username };
  return await client.db("safe_speech").collection("users").findOne(query);
}

/**
 * Gets all the chats in which the user is listed as a participant.
 * @param username the username to query for.
 * @returns {Promise<WithId<Document>[]>} list of all chats in which the user is listed as a participant.
 */
async function getUserChats(username) {
  await client.connect();
  let query = { participants: { username: username } };
  const cursor = await client.db("safe_speech").collection("chats").find(query);
  return await cursor.toArray();
}

/**
 * Gets a chat with the matching chat ID.
 * @param chatId the chat ID to query for.
 * @returns {Promise<Document & {_id: InferIdType<Document>}>} the chat with the matching ID.
 */
async function getChat(chatId) {
  await client.connect();
  let query = { _id: chatId };
  return await client.db("safe_speech").collection("chats").findOne(query);
}

/**
 * Removes a user from the chat.
 * @param chatId the chat ID to query for.
 * @param username the user that is leaving the chat
 */
async function leaveChat(chatId, username) {
  try {
    await client.connect();
    let query = { _id: chatId };
    let removeUser = { $pull: { participants: { username: username } } };
    let result = await client
      .db("safe_speech")
      .collection("chats")
      .findOneAndUpdate(query, removeUser);
    console.log(result);
  } catch (e) {
    console.log(e.message);
  } finally {
    await client.close();
  }
}

/**
 * Functions to handle a connection
 */
io.on("connection", (socket) => {
  console.log("Connection started");
  // ask user username in case the socket knows its username
  io.to(socket.id).emit("get username");
  // TODO on disconnect remove socket from map
  /**
   * Retrieves user with specified username and sends it to the requesting socket.
   */
  socket.on("get user", async (username) => {
    io.to(socket.id).emit("user info", await getUser(username));
  });
  /**
   * Retrieves chats where user with username is listed as a participant and sends it to the requesting socket.
   */
  socket.on("get chats", async (userName) => {
    io.to(socket.id).emit("user chats", await getUserChats(userName));
  });
  /**
   * Creates a chat with the specified information in the DB.
   */
  socket.on("create chat", async (chatTitle, messages, users) => {
    const cretedChatId = await createChat(chatTitle, messages, users);
    users.forEach((user) => {
      let socketId = userSocketIds.get(user.username);
      if (socketId) {
        io.to(socketId).emit("chat", {
          chatTitle: chatTitle,
          messages: messages,
          participants: users,
          _id: cretedChatId,
        });
      }
    });
  });
  /**
   * Adds a message to the specified chat, and pushes the new message to all chat participants.
   */
  socket.on("add message to chat", async (content, sender, chatId) => {
    // assuming you get just the string otherwise ObjectId not necessary
    let msgPayload = {
      content: content,
      username: sender,
      timestamp: new Date(),
    };
    await addMessageToChat(msgPayload, ObjectId(chatId));
    // send message to all participants
    const chat = await getChat(ObjectId(chatId));
    const users = chat.participants;
    users.forEach((user) => {
      console.log(user);
      let socketId = userSocketIds.get(user.username);
      console.log(socketId);
      if (socketId) {
        io.to(socketId).emit("message", msgPayload, chatId);
      }
    });
  });
  /**
   * Sets the public key for a username
   */
  socket.on("set pubkey", (obj) => {
    console.log(obj);
    userKeys.set(obj.user, obj.key);
    console.log(userKeys.get(obj.user));
  });
  /**
   * Gets the public key for a username
   */
  socket.on("get pubkey", (obj) => {
    console.log("Pub key request for " + obj.user);
    let pubKey = { user: obj.user, pubKey: userKeys.get(obj.user) };
    console.log(pubKey);
    io.to(socket.id).emit("pubkey", pubKey);
  });
  /**
   * Sets a username as logged in
   */
  socket.on("logged in", (username) => {
    console.log(username + " is logged in");
    userSocketIds.set(username, socket.id);
  });
  /**
   * Sets a username as logged out and closes the socket.
   */
  socket.on("logged out", (username) => {
    console.log(username + " has logged out");
    userSocketIds.delete(username);
  });
  /**
   * Attempts to register a user with the given credentials.
   */
  socket.on("register user", async (credentials) => {
    const user = await getUser(credentials.username);
    if (user) {
      console.log("Found a user with username");
      io.to(socket.id).emit("bad username");
    } else {
      console.log("good");
      io.to(socket.id).emit("ok username");
      // add to db
      await addUser(credentials);
      userSocketIds.set(credentials.username, socket.id);
    }
  });
  /**
   * Removes a user from a chat.
   */
  socket.on("leave chat", async (data) => {
    console.log(data);
    await leaveChat(ObjectId(data.id), data.user);
  });
});

/**
 * Starts a server at the port
 */
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
