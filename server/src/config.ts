//ngehandle dotenv aja
import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
export const NODE_ENV = process.env.NODE_ENV || "development";
const envFile = NODE_ENV === "development" ? ".env" : ".env.test";

config({
  path: resolve(__dirname, `../${envFile}`),
  override: true,
});

export const PORT = process.env.PORT || 8002;

export const prisma = new PrismaClient();

export const jwt_secret = process.env.ACCESS_SECRET || "";

export const refresh_jwt_secret = process.env.REFRESH_SECRET || "";
