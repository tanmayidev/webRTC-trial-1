const socket = io("/"); // socket connects to root path of our app

const videoGrid = document.getElementById("video-grid");

const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

const myVideo = document.createElement("video");
myVideo.muted = true; // mutes our video for ourselves and not for others

//connect video
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
  });

// on "join-room" event (sends event to server)
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

// on "user-connected" event
socket.on("user-connected", (userId) => {
  console.log("User connected " + userId);
});

// takes video and stream and plays the video , appends the video to stream
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
