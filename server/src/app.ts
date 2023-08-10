import express from "express";
import cors from "cors";
import router from "./routes/router";

const app = express();
const corsOptions = {
  origin: "*",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use("/", router);

export default app;
