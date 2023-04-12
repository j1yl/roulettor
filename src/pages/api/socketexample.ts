import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "GET") {
    const message = {
      status: "ok",
      message: "Hello World",
    };
    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("message", message);

    // return message
    res.status(201).json(message);
  }
};
