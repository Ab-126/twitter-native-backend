import express from "express";
import UserRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticeToken } from "./middlewares/authMiddleware";

const app = express();
app.use(express.json());
app.use("/user", authenticeToken, UserRoutes);
app.use("/tweet", authenticeToken, tweetRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("Server ready at localhost: 3000");
});
