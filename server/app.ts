import { createServer } from "http";
import { Server } from "socket.io";
import { Timer } from "easytimer.js";
import winston from "winston";
import crypto from "crypto";

/**
 * TYPES
 */
interface RouletteGameData {
  id: string;
  status: string;
  clock: string;
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
    origin: process.env.CLIENT_URL,
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

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

io.on("connection", (socket) => {
  socket.on("placeBet", (data: RouletteBetData) => {
    rouletteGameData.bets.push(data);
    // try {
    //   io.emit("receivedBet")
    // } catch (e) {
    //   logger.error(e)
    // }
  });
});

httpServer.listen(3001, () => {
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
    return "red";
  } else if (spin % 2 === 1) {
    return "black";
  } else if (spin === 0) {
    return "green";
  }
};

/**
 * GAME
 */
timer.addEventListener("secondsUpdated", () => {
  rouletteGameData.clock = timer.getTimeValues().toString();

  if (rouletteGameData.clock === "00:01:00") {
    rouletteGameData.status = "started";
  }

  if (rouletteGameData.clock === "00:00:55") {
    rouletteGameData.status = "ended";
    rouletteGameData.value = getRollSpin(Date.now().toString());
    rouletteGameData.color = getRollColor(rouletteGameData.value);
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
