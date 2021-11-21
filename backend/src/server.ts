import express, { Express } from "express";
import path from "path";
import { Server } from "http";

export class HTTPServer {
  handler: (req: any) => boolean;
  app: Express;
  server: Server;
  constructor() {
    const app = express();
    app.use(express.json());
    app.post("/api", (req, res) => {
      console.log("HTTP Request:", req.body);
      const success = this.handler(req.body);
      if (success) {
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    });
    app.use("/", express.static(path.join(__dirname, "../frontend")));
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/index.html"));
    });
    const server = app.listen(8080, () => {
      console.log("Starting HTTP Server on port 8080");
    });

    this.handler = () => true;
    this.app = app;
    this.server = server;
  }
  onRequest(handler: (req: any) => boolean) {
    this.handler = handler;
  }
  close() {
    this.server.close();
  }
}
