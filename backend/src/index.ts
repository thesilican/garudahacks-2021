import { spawn } from "child_process";
import { createInterface } from "readline";
import { env } from "./env";

function main() {
  const child = spawn(env.command, { shell: true });
  const rl = createInterface({
    input: child.stdout,
    output: child.stdin,
  });
  rl.on("line", (line) => {
    console.log("Child program:", line);
  });
  child.on("exit", () => {
    console.log("Child program exited");
  });
}

main();
