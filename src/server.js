import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());

// Use the master router
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Glow AI backend working.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
