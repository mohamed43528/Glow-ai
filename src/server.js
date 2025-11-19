import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
import registerRoutes from "./routes/index.js";
registerRoutes(app);

// Root health check
app.get("/", (req, res) => {
  res.send("Glow AI backend is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
