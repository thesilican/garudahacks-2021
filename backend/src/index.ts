import { HardwareInterface } from "./hardware";

const hw = new HardwareInterface();

hw.onLine((line) => {
  hw.writeLine(line);
});
