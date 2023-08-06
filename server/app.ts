import express from "express";
import http from "http";
import { Server } from "socket.io";
import crypto from "crypto";
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let gameState = {
  rouletteNumber: null,
  players: [],
};

/**
 *
 * INITIALLIZATION SOCKETS
 *
 */

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
});

/**
 *
 * HELPER FUNCTIONS
 *
 */

function resetGame() {
  gameState = {
    rouletteNumber: null,
    players: [],
  };
}

function randomRouletteNumber() {
  const hash = crypto
    .createHmac("sha256", new Date().toISOString())
    .digest("hex");
  const subHash = hash.substring(0, 8);
  const spinNumber = parseInt(subHash, 16);
  return Math.abs(spinNumber % 15);
}

/**
 *
 * SERVER
 *
 */
server.listen(3001, () => {
  console.log("Listening on *:3001");
});
