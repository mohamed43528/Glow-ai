import express from "express"; import cors from "cors"; import dotenv from "dotenv"; import bodyParser from "body-parser"; import { PrismaClient } from "@prisma/client";

dotenv.config();
