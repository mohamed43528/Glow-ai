import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/index.js";

dotenv.config();
const app = express();

app.use(express.json());

// Mount all routes under /api
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Glow AI backend is running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
