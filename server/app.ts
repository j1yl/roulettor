import { createServer } from "http";
import { Server } from "socket.io";
import { Timer } from "easytimer.js";
import winston from "winston";
import crypto from "crypto";
import axios from "axios";
require("dotenv").config();

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
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
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

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

io.on("connection", (socket) => {
  logger.info(`a user connected ${socket.id}`);
  socket.on("betPlaced", (bet: RouletteBetData) => {
    if (!rouletteGameData.bets.find((b) => b.id === bet.id)) {
      logger.info(`bet received: ${bet.id} ${bet.betColor} ${bet.betAmount}`);
      rouletteGameData.bets.push(bet);
    }
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
  if (spin === 0) {
    return "green";
  } else if (spin % 2 === 0) {
    return "black";
  } else if (spin % 2 === 1) {
    return "red";
  }
};

const sendGameUpdate = (data: RouletteGameData) => {
  io.emit("gameUpdate", data);
};

/**
 * GAME
 */
timer.addEventListener("secondsUpdated", () => {
  rouletteGameData.clock = timer.getTimeValues().seconds;

  if (timer.getTimeValues().toString() === "00:01:00") {
    rouletteGameData.status = "started";

    try {
      axios.get(`${process.env.CLIENTURL}/api/roulette/start`).then((res) => {
        rouletteGameData = res.data;
        logger.info(`${res.data.id} has started`);
      });
    } catch (e) {
      logger.error(e);
    }
  }

  if (timer.getTimeValues().toString() === "00:00:00") {
    rouletteGameData.status = "ended";
    rouletteGameData.value = getRollSpin(Date.now().toString());
    rouletteGameData.color = getRollColor(rouletteGameData.value);

    try {
      axios
        .post(`${process.env.CLIENTURL}/api/roulette/spin`, rouletteGameData)
        .then((res) => {
          logger.info(`${res.data.id} has ended`);
          rouletteGameData.bets = [];
        });
    } catch (e) {
      logger.error(e);
    }
  }

  sendGameUpdate(rouletteGameData);
  if (rouletteGameData.clock % 10 === 0) {
    console.log(rouletteGameData.clock);
  }
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

httpServer.listen(
  parseInt(process.env.PORT as string) || 3001,
  process.env.HOST || "0.0.0.0",
  10,
  () => {
    console.log(`started on port ${process.env.PORT}`);
    timer.start({
      precision: "seconds",
      countdown: true,
      startValues: { seconds: 65 },
    });
  }
);
