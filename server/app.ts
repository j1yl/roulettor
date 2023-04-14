import { createServer } from "http";
import { Server } from "socket.io";
import { Timer } from "easytimer.js";
import axios from "axios";

/**
 *
 * TYPES
 *
 */
interface GameInfo {
  id: string;
  timeRemaining: number;
  gameState?: "STARTED" | "ENDED" | "PREPARING";
  winningColor?: "red" | "black" | "green" | "none";
  winningValue?: number;
  bets: BetInfo[];
}

interface BetInfo {
  id: string;
  status: "won" | "lost" | "pending";
  userId: string;
  gameId: string;
  betColor: string;
  betAmount: number;
  payout: number;
  createdAt?: Date;
}

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
  console.log(">>>>>USER CONNECTED", socket.id);
  socket.on("betPlaced", (data: BetInfo) => {
    gameData.bets.push(data);
    // {
    //   id: 'clgft1bsj0003liz5und7hovi',
    //   status: 'pending',
    //   userId: 'clgfp0jlb000ulifi47ckhaxn',
    //   gameId: 'clgft15cg0000liz5azljwc28',
    //   betColor: 'green',
    //   betAmount: 100,
    //   createdAt: '2023-04-14T00:22:06.835Z'
    // }
    socket.emit("betReceived", gameData.bets);
  });
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
 * DEFAULT GAME DATA
 *
 */
let gameData: GameInfo = {
  id: "",
  timeRemaining: 0,
  gameState: "PREPARING",
  winningColor: "none",
  winningValue: 0,
  bets: [],
};

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
  console.log(
    `TIME: ${data.timeRemaining.toString()}\nGAME UPDATE: ${
      data.gameState
    }\nGAME ID: ${data.id}\n`
  );
};

timer.addEventListener("secondsUpdated", (e) => {
  gameData = {
    ...gameData,
    timeRemaining: timer.getTimeValues().seconds,
  };

  if (timer.getTimeValues().toString() === "00:01:00") {
    /**
     * CREATE NEW GAME
     */
    gameData.gameState = "STARTED";
    try {
      axios
        .post("http://localhost:3000/api/roulette/create", gameData)
        .then((res) => {
          gameData = {
            ...gameData,
            id: res.data.data.id,
          };
        });
    } catch (e) {
      console.error(e);
    }
  } else if (timer.getTimeValues().toString() === "00:00:00") {
    /**
     * END GAME
     */
    gameData.gameState = "ENDED";
    gameData.winningValue = getRandomInt(14); // change to more secure random number gen
    gameData.winningColor = getWinningColor(gameData.winningValue);
    /**
     * PAYOUT
     */
    try {
      axios.get("http://localhost:3000/api/roulette/payout").then((res) => {});
    } catch (e) {
      console.error(e);
    }

    gameData.bets.forEach((item) => {
      if (item.betColor === gameData.winningColor) {
        item.status = "won";
      } else {
        item.status = "lost";
      }
      try {
        axios
          .post("http://localhost:3000/api/roulette/save/bet", item)
          .then((res) => {
            // payout !!!
            gameData.bets = [];
          });
      } catch (e) {
        console.error(e);
      }
    });

    try {
      axios
        .post("http://localhost:3000/api/roulette/save/game", gameData)
        .then((res) => {
          gameData = {
            ...gameData,
            id: res.data.data.id,
          };
        });
    } catch (e) {
      console.error(e);
    }
  }
  sendGameUpdate(gameData);
});

/**
 *
 * PAUSE THE GAME FOR 5 SECONDS
 *
 */
timer.addEventListener("targetAchieved", () => {
  console.log(
    `TIMER ${timer.getTimeValues().toString()} PAUSING FOR 5 SECONDS`
  );
  timer.pause();
  setTimeout(() => {
    console.log(`TIMER ${timer.getTimeValues().toString()} RESUMING THE GAME`);
    timer.reset();
    timer.start({
      precision: "seconds",
      countdown: true,
      startValues: { seconds: 65 },
    });
  }, 5000);
});
