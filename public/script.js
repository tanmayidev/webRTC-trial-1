const socket = io("/"); // socket connects to root path of our app

// sends event to server
socket.emit("join-room", ROOM_ID, 10);
