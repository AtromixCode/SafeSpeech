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
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.yiun1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

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
      console.log("bad username");
      socket.emit("bad username");
    }
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
    console.log(user);
    await client.connect();
    let query = { username: user.userName };
    const result = await client
      .db("safe_speech")
      .collection("users")
      .find(query);

    console.log("Here" + result);
    if (result == undefined) {
      socket.emit("bad credentials");
    } else {
      let hash = result.password;
      bcrypt.compare(saltedHash, hash, function (err, result) {
        if (result) {
          socket.emit("login ok", result[0]);
        } else {
          socket.emit("bad credentials");
        }
      });
    }
  } catch (e) {
    console.log(e.message);
  } finally {
    //await client.close();
  }
}

io.on("connection", (socket) => {
  console.log("Connection started");

  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("check new login", function (credentials) {
    console.log(credentials);
    checkUsernameExists(credentials, socket);
  });

  socket.on("check login credentials", (credentials) => {
    //login
    console.log("logging in");
    checkLoginCredentials(credentials, socket);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
