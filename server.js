const express = require("express");
const app = express();
const server = require("http").Server(app); // allows to create server to be used with socket.io
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs"); //rendering views using ejs
app.use(express.static("public")); //all js and css files will be in public folder

app.get("/", (req, res) => {
  res.redirect(`${uuidV4()}`); // appends uuid to end of url
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room }); // renders view called room
});

// runs when user connects to webpage
io.on("connection", (socket) => {
  // event-listener join-room is called when user connects to room
  socket.on("join-room", (roomId, userId) => {
    /* setup video connection with new user telling all existing users that new user joined*/
    socket.join(roomId); // join room
    socket.broadcast.to(roomId).emit("user-connected", userId);
    // socket.to(roomId).emit("user-connected", userId)
    // broadcast message to everyone except yourself
  });
});

server.listen(3000);
