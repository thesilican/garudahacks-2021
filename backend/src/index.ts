import SerialPort from "serialport";
import ReadLine from "@serialport/parser-readline";

const port = new SerialPort("COM4", { baudRate: 9600 })