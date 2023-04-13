import { createServer } from "http";
import { Server } from "socket.io";
import { Timer } from "easytimer.js";
import axios from "axios";

/**
 *
 * INITIALIZATION
 *
 */
var timer = new Timer();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
});

httpServer.listen(3001, () => {
  timer.start({
    precision: "seconds",
    countdown: true,
    startValues: { seconds: 65 },
  });
});

/**
 *
 * TYPES
 *
 */
interface GameInfo {
  timeRemaining: number;
  id: string;
  gameState?: "STARTED" | "ENDED";
  winningColor?: "red" | "black" | "green" | "none";
  winningValue?: number;
  bets: [];
}

interface BetInfo {
  id: string;
  userId: string;
  gameId: string;
  betColor: string;
  betAmount: number;
  createdAt: Date;
}

let gameData = {} as GameInfo;

/**
 *
 * GAME LOGIC
 *
 */
const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const getWinningColor = (value: number) => {
  if (value === 0) {
    return "green";
  } else if (value % 2 === 0) {
    return "black";
  } else if (value % 2 === 1) {
    return "red";
  } else {
    return "none";
  }
};

const sendGameUpdate = (data: GameInfo) => {
  io.emit("gameUpdate", data);
  console.log(new Date().toUTCString(), "Emitted gameUpdate", data);
};

const sendTimeUpdate = (currentSeconds: number) => {
  io.emit("timeUpdate", currentSeconds);
  // console.log(new Date().toUTCString(), "Emitted timeUpdate", currentSeconds);
};

timer.addEventListener("secondsUpdated", async (e) => {
  let currentSeconds = timer.getTimeValues().seconds;
  gameData.timeRemaining = currentSeconds;
  // console.log(timer.getTimeValues().toString());
  sendTimeUpdate(Math.abs(currentSeconds - 60));

  if (timer.getTimeValues().toString() === "00:01:00") {
    // CREATE NEW GAME
    gameData.timeRemaining = 59;
    gameData.gameState = "STARTED";
    sendGameUpdate(gameData);
  } else if (timer.getTimeValues().toString() === "00:00:00") {
    // END GAME
    gameData.gameState = "ENDED";
    gameData.winningValue = getRandomInt(14);
    gameData.winningColor = getWinningColor(gameData.winningValue);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/roulette/save",
        gameData
      );

      res.data.data.timeRemaining = 60 - gameData.timeRemaining;
      sendGameUpdate(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }
});

timer.addEventListener("targetAchieved", () => {
  console.log("Pausing for 5 seconds");
  timer.pause();
  setTimeout(() => {
    console.log("Resuming", timer.getTimeValues().toString());
    timer.reset();
    timer.start({
      precision: "seconds",
      countdown: true,
      startValues: { seconds: 65 },
    });
  }, 5000);
});
