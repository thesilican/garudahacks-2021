import express, { Express } from "express";
import path from "path";
import { Server } from "http";

export class HTTPServer {
  handler: (req: any) => void;
  app: Express;
  server: Server;
  constructor() {
    const app = express();
    app.use(express.json());
    app.post("/api", (req, res) => {
      res.sendStatus(204);
      this.handler(req);
    });
    app.use("/", express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
    const server = app.listen(8080, () => {
      console.log("Starting HTTP Server on port 8080");
    });

    this.handler = () => {};
    this.app = app;
    this.server = server;
  }
  onRequest(handler: (req: any) => void) {
    this.handler = handler;
  }
  close() {
    this.server.close();
  }
}
