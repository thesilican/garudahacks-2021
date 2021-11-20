import SerialPort, { parsers } from "serialport";
import readline from "readline";
import { env } from "../env";

export class HardwareInterface {
  onLine: (handleLine: (line: string) => void) => void;
  writeLine: (line: string) => void;
  constructor() {
    if (env.dev) {
      const rl = readline.createInterface({ input: process.stdin });
      this.onLine = (handler) => {
        rl.on("line", (line) => {
          console.log("Read:", line);
          handler(line);
        });
      };
      this.writeLine = (line) => {
        console.log("Write:", line);
      };
    } else {
      const port = new SerialPort("COM4", { baudRate: 9600 });
      const parser = port.pipe(new parsers.Readline({ delimiter: "\n" }));
      port.on("open", () => {
        console.log("Port open");
      });
      this.onLine = (handler) => {
        parser.on("data", (line) => {
          console.log("Read:", line);
          handler(line);
        });
      };
      this.writeLine = (line) => {
        console.log("Write:", line);
        port.write(line + "\n");
      };
    }
  }
}
