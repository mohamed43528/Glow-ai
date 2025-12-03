import express from "express"; import cors from "cors"; import dotenv from "dotenv"; import bodyParser from "body-parser"; import { PrismaClient } from "@prisma/client";

import { authRoutes, customerRoutes, businessRoutes } from "./src/index.js";

dotenv.config();

const app = express(); const prisma = new PrismaClient();

app.use(cors()); app.use(bodyParser.json());

app.get("/health", (req, res) => { res.json({ status: "ok", service: "Glow AI Backend" }); });

app.get("/test-gpt5", (req, res) => { res.json({ ok: true, message: "GPT-5 connection pending implementation" }); });

// CHUNK B app.use("/auth", authRoutes); app.use("/customer", customerRoutes); app.use("/business", businessRoutes);

// CHUNK C (placeholder) app.use("/booking", (req, res) => res.status(501).json({ error: "Not implemented (Chunk C)" })); app.use("/ai", (req, res) => res.status(501).json({ error: "Not implemented (Chunk C)" }));

const PORT = process.env.PORT || 4000; app.listen(PORT, () => { console.log("Glow AI backend running on port " + PORT); });
