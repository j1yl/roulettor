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
  console.log(`Server is running on port 3001`);
  timer.start({ precision: "seconds" });
});

/**
 *
 * TYPES
 *
 */
interface GameInfo {
  id: string;
  gameState?: "STARTED" | "ENDED";
  winningColor?: "red" | "black" | "green" | "none";
  winningValue?: number;
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

const sendGameStageUpdate = (data: GameInfo) => {
  io.emit("gameStageUpdate", data);
  console.log("Emitted gameStageUpdate", data);
};

timer.addEventListener("secondsUpdated", async (e) => {
  let currentSeconds = timer.getTimeValues().seconds;
  console.log(currentSeconds);

  if (currentSeconds === 5) {
    gameData.gameState = "STARTED";
    sendGameStageUpdate(gameData);
  } else if (currentSeconds === 10) {
    gameData.gameState = "ENDED";
    gameData.winningValue = getRandomInt(37);
    gameData.winningColor = getWinningColor(gameData.winningValue);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/roulette/save",
        gameData
      );
      sendGameStageUpdate(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }
});
