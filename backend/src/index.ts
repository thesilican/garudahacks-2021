import { spawn } from "child_process";
import { createInterface } from "readline";
import { env } from "./env";

function writeLine(line: string) {
  console.log("Write:", line);
  child.stdin.write(line);
}
function handleLine(line: string) {
  console.log("Read:", line);
  setTimeout(() => {
    writeLine(line);
  }, 100);
}

const child = spawn(env.command, { shell: true });
const rl = createInterface({ input: child.stdout });
rl.on("line", (line) => {
  if (line.startsWith("---")) {
    return;
  }
  handleLine(line);
});
child.on("exit", () => {
  console.log("Child program exited");
});
