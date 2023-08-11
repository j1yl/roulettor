import { Server, Socket } from "socket.io";
import http from "http";

import app from "./app";
import {
  startGameLoop,
  getBets,
  nextGameStartTime,
} from "./roulette/gameState";

const server = http.createServer(app);
export const io = new Server(server);

io.on("connection", (socket: Socket) => {
  socket.emit("existingBets", getBets());
  socket.emit("nextGameStart", { nextGameStartTime });
  console.log("a player connected", socket.id);
});

server.listen(process.env.PORT || 3001, () => {
  console.log(`listening on *:${process.env.PORT || 3000}`);
  startGameLoop(io);
});
