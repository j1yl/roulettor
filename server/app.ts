import { createServer } from "http";
import { Server } from "socket.io";
import { Timer } from "easytimer.js";

// CREATE THE SERVER
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("USER HAS CONNECTED", socket.id);
});

io.on("placeBet", (res) => {
  console.log(res);
});

httpServer.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});

var timer = new Timer();

timer.addEventListener("secondsUpdated", (e) => {
  let currentSeconds = timer.getTimeValues().seconds;
});
