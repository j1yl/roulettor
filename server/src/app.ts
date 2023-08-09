import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use("/", userRoutes);

export default app;
