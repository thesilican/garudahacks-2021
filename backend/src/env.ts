import dotenv from "dotenv";
dotenv.config();

export const env = {
  token: process.env.TOKEN!,
  dev: process.env.DEV!,
};
