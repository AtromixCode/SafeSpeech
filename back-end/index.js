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

async function checkUsernameExists(user, socket) {
  try {
    await client.connect();
    let query = { username: user.userName };
    const result = await client
      .db("safe_speech")
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
    if (result != undefined) {
      addUser(credentials);
      console.log("username OK");
      socket.emit("ok username");
    } else {
      console.log("bad username");
      socket.emit("bad username");
    }
  } catch (e) {
    console.log(e.message);
  } finally {
    await client.close();
  }
}

async function checkLoginCredentials(user, socket) {
  try {
    await client.connect();
    let query = { username: user.userName };
    const result = await client
      .db("safe_speech")
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
    if (result.length == 0) {
      socket.emit("bad credentials");
    } else {
      let hash = result[0].password;
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
    await client.close();
  }
}

io.on("connection", (socket) => {
  console.log("Connection started");

  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("check new login", function (credentials) {
    console.log("registering");
    checkUsernameExists(credentials, socket);
  });

  socket.on("check login credentials", function (credentials) {
    //login
    console.log("logging in");
    checkLoginCredentials(credentials, socket);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
