import { createServer } from "http";
import { Server } from "socket.io";
import { Timer } from "easytimer.js";
import winston from "winston";
import crypto from "crypto";
import axios from "axios";
import express from "express";

/**
 * TYPES
 */
interface RouletteGameData {
  id?: string;
  status: string;
  clock: number;
  color?: string;
  value?: number;
  bets: RouletteBetData[];
}

interface RouletteBetData {
  id: string;
  gameId: string;
  userId: string;
  betColor: string;
  betAmount: number;
  payout: number;
  status: string;
}

/**
 * INITIALIZATION
 */
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENTURL,
  },
});
const timer = new Timer();

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// if (process.env.NODE_ENV !== "production") {
logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);
// }

io.on("connection", (socket) => {
  logger.info(`a user connected ${socket.id}`);
  socket.on("betPlaced", (bet: RouletteBetData) => {
    logger.info(`bet placed ${bet.id}`);
    rouletteGameData.bets.push(bet);
  });
});

httpServer.listen(process.env.PORT || 5000, () => {
  console.log(`started on port ${process.env.PORT}`);
  timer.start({
    precision: "seconds",
    countdown: true,
    startValues: { seconds: 65 },
  });
});

let rouletteGameData = {} as RouletteGameData;

/**
 * HELPER FUNCTIONS
 */
const getRollSpin = (seed: string) => {
  const hash = crypto.createHmac("sha256", seed).digest("hex");
  const subHash = hash.substring(0, 8);
  const spinNumber = parseInt(subHash, 16);
  return Math.abs(spinNumber) % 15;
};

const getRollColor = (spin: number) => {
  if (spin % 2 === 0) {
    return "black";
  } else if (spin % 2 === 1) {
    return "red";
  } else if (spin === 0) {
    return "green";
  }
};

const sendGameUpdate = (data: RouletteGameData) => {
  io.emit("gameUpdate", {
    ...data,
  });
};

/**
 * GAME
 */
timer.addEventListener("secondsUpdated", () => {
  rouletteGameData.clock = timer.getTimeValues().seconds;

  if (timer.getTimeValues().toString() === "00:01:00") {
    rouletteGameData.status = "started";

    axios
      .get(`${process.env.CLIENTURL}/api/roulette/start`)
      .then((data) => {
        rouletteGameData = data.data;
        logger.info(`${data.data.id} has started`);
      })
      .catch((e) => {
        logger.error(e);
      });
  }

  if (timer.getTimeValues().toString() === "00:00:00") {
    rouletteGameData.status = "ended";
    rouletteGameData.value = getRollSpin(Date.now().toString());
    rouletteGameData.color = getRollColor(rouletteGameData.value);

    axios
      .post(`${process.env.CLIENTURL}/api/roulette/spin`, rouletteGameData)
      .then((data) => {
        logger.info(`${data.data.id} has ended`);
        rouletteGameData.bets = [];
      })
      .catch((e) => {
        logger.error(e);
      });
  }

  sendGameUpdate(rouletteGameData);
});

timer.addEventListener("targetAchieved", () => {
  logger.info("pausing the game (5s)");
  timer.pause();
  setTimeout(() => {
    logger.info("resuming the game");
    timer.reset();
    timer.start({
      precision: "seconds",
      countdown: true,
      startValues: { seconds: 65 },
    });
  }, 5000);
});
