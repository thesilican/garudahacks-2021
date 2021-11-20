import express, { Express } from "express";
import { Server } from "http";

export class HTTPServer {
  handler: (req: any) => void;
  app: Express;
  server: Server;
  constructor() {
    const app = express();
    app.use(express.json());
    app.get("/backend", (req, res) => {
      res.sendStatus(204);
      this.handler(req);
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
