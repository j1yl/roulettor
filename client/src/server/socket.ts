import { io } from "socket.io-client";
import { env } from "~/env.mjs";

const socket = io(env.NEXT_PUBLIC_SOCKET_URL);

export default socket;
