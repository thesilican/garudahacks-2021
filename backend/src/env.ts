import dotenv from "dotenv";
dotenv.config();

export const env = {
  token: process.env.TOKEN!,
  command: process.env.COMMAND!,
  dev: process.env.DEV!,
};
