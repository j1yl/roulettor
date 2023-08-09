import http from "http";
import { Server } from "socket.io";
import app from "./app";
import setupSockets from "./sockets";
import { startGameLoop } from "./roulette/gameState";

const server = http.createServer(app);
const io = new Server(server);

setupSockets(io);

server.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on *:${process.env.PORT || 3000}`);
  startGameLoop(io);
});
