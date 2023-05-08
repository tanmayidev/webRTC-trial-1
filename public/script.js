const socket = io("/"); // socket connects to root path of our app

const videoGrid = document.getElementById("video-grid");

const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

const myVideo = document.createElement("video");
myVideo.muted = true; // mutes our video for ourselves and not for others

// object to keep track of all users we called
const peers = {};

//connect video and audio to send to other people
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    //calling addVideoStream function
    addVideoStream(myVideo, stream);

    // listen to the call event
    myPeer.on("call", (call) => {
      // answers the call and add user to our stream
      // but does not add our video to the user who called us
      // user2 calls user1 (both have their videos visible)
      // user2 video added to user1 video call page
      // user1 video NOT added to user2 video page
      call.answer(stream);

      // create video element for user1 to pass to user2
      const video = document.createElement("video");

      // pass the user1 video stream to user2
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // when user connects call connectToNewuser function
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

// on user disconnected - close the connection if userId exists in the peers object
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

// on "join-room" event (sends event to server)
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  // calling user with userId and sending our video and audio stream
  const call = myPeer.call(userId, stream);

  // create video element for new user created
  const video = document.createElement("video");

  // we are taking video stream from the other user that we are calling and adding it to video element on our page
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

// takes video and stream and plays the video , appends the video to stream
function addVideoStream(video, stream) {
  video.srcObject = stream;
  // adding event listener to video on loadedmetadata
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
