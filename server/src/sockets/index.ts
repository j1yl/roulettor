import { Server, Socket } from "socket.io";
import { Bet } from "../roulette/gameTypes";
import { placeBet } from "../roulette/gameState";

export default function setupSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    socket.on("placeBet", (betData: Bet) => {
      placeBet(betData.userId, betData.number, betData.amount, betData.color);
      io.emit("newBet", betData);
    });
  });
}
