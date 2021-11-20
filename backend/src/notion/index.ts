import { Client } from "@notionhq/client";
import { env } from "../env";

export class Notion {
  client: Client;
  constructor() {
    this.client = new Client({ auth: env.token });
  }
}
