import { io, Socket } from "socket.io-client";

let socket: Socket | { on: () => void; emit: () => void; off: () => void };

if (typeof window !== "undefined") {
  socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
    transports: ["websocket"],
  });
} else {
  socket = { on: () => {}, emit: () => {}, off: () => {} };
}

export default socket;
