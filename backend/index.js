const SerialPort = require("serialport")
const Readline = require("@serialport/parser-readline")

const port = new SerialPort("COM4", { baudRate: 9600 })
const parser = port.pipe(new Readline({ delimeter: "\n" }))
port.on("open", () => {
    console.log("Port open");
})

parser.on("data", data => {
    console.log("Read:", data);
    port.write("Hello\n")
})