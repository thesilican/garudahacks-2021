import { Client } from "@notionhq/client";
import { env } from "./env";
import { getDateString } from "./util";

// Read-write databases
export type FridgeItem = {
  name: string;
  coverImg: string;
  datePurchased: Date;
  dateExpires: Date;
};
export type IngredientItem = {
  name: string;
  coverImg: string;
  shelfLife: number;
  ecoScore: number;
};
export type RecipeItem = {
  name: string;
  ingredients: string[];
  timeToMake: number;
  ecoScore: number;
  recommended: boolean;
};
export type StoreItem = {
  name: string;
  stock: string[];
  ecoScore: number;
  recommended: boolean;
};

export class Notion {
  client: Client;
  constructor() {
    console.log("Creating Notion Client");
    this.client = new Client({ auth: env.token });
  }

  async readFridge(): Promise<FridgeItem[]> {
    const res = await this.client.databases.query({
      database_id: "7891599d569e4f8592a97345ea613db7",
    });
    return res.results.map((x: any) => {
      const name = x.properties.Name.title[0]?.text.content;
      const coverImg = x.cover.external?.url ?? x.cover.file.url;
      const datePurchased = new Date(x.properties["Date Purchased"].date.start);
      const dateExpires = new Date(x.properties["Date Expires"].date.start);
      return { name, coverImg, datePurchased, dateExpires };
    });
  }
  async insertFridge(item: FridgeItem) {
    await this.client.pages.create({
      parent: { database_id: "7891599d569e4f8592a97345ea613db7" },
      cover: {
        type: "external",
        external: {
          url: item.coverImg,
        },
      },
      properties: {
        Name: {
          title: [{ text: { content: item.name } }],
        },
        "Date Purchased": {
          type: "date",
          date: { start: getDateString(item.datePurchased) },
        },
        "Date Expires": {
          type: "date",
          date: { start: getDateString(item.dateExpires) },
        },
      },
    });
  }
  async deleteFridge(name: string) {
    const res = await this.client.databases.query({
      database_id: "7891599d569e4f8592a97345ea613db7",
      filter: {
        property: "Name",
        text: {
          contains: name,
        },
      },
    });
    const page = res.results[0];
    if (page) {
      await this.client.pages.update({ page_id: page.id, archived: true });
    }
  }
  async deleteAllFridge() {
    const res = await this.client.databases.query({
      database_id: "7891599d569e4f8592a97345ea613db7",
    });
    for (const page of res.results) {
      await this.client.pages.update({ page_id: page.id, archived: true });
    }
  }

  async readIngredients(): Promise<IngredientItem[]> {
    const res = await this.client.databases.query({
      database_id: "d7dd5f1c39c149f4a3c34957f69aec9b",
    });
    return res.results.map((x: any) => {
      const name = x.properties.Name.title[0]?.text.content;
      const coverImg = x.properties["Cover Image"].url;
      const shelfLife = x.properties["Shelf Life"].number;
      const ecoScore = x.properties["Eco Score"].number;
      return {
        name,
        coverImg,
        shelfLife,
        ecoScore,
      };
    });
  }

  async readRecipes(): Promise<RecipeItem[]> {
    const res = await this.client.databases.query({
      database_id: "e98717b4b33d4ff08a54a5a7d0801f96",
    });
    return res.results.map((x: any) => {
      const name = x.properties.Name.title[0]?.text.content;
      const ingredients = x.properties.Ingredients.multi_select.map(
        (x: any) => x.name
      );
      const timeToMake = x.properties["Time to Make (min)"].number;
      const ecoScore = x.properties["Eco Score"].number;
      const recommended = x.properties.Recommended.checkbox;
      return { name, ingredients, timeToMake, ecoScore, recommended };
    });
  }
  async updateRecipe(name: string, recommended: boolean) {
    const res = await this.client.databases.query({
      database_id: "e98717b4b33d4ff08a54a5a7d0801f96",
      filter: { property: "Name", text: { equals: name } },
    });
    for (const page of res.results) {
      await this.client.pages.update({
        page_id: page.id,
        properties: {
          Recommended: {
            checkbox: recommended,
          },
        },
      });
    }
  }

  async readStores(): Promise<StoreItem[]> {
    const res = await this.client.databases.query({
      database_id: "aa5b5d92fd4d40d0b6b9bea77e84b0ef",
    });
    return res.results.map((x: any) => {
      const name = x.properties.Name.title[0]?.text.content;
      const stock = x.properties.Stock.multi_select.map((x: any) => x.name);
      const ecoScore = x.properties["Eco Score"].number;
      const recommended = x.properties.Recommended.checkbox;
      return { name, stock, ecoScore, recommended };
    });
  }
  async updateStore(name: string, recommended: boolean) {
    const res = await this.client.databases.query({
      database_id: "aa5b5d92fd4d40d0b6b9bea77e84b0ef",
      filter: { property: "Name", text: { equals: name } },
    });
    for (const page of res.results) {
      await this.client.pages.update({
        page_id: page.id,
        properties: {
          Recommended: {
            checkbox: recommended,
          },
        },
      });
    }
  }

  async updateEcoScore(value: number) {
    await this.client.blocks.update({
      block_id: "a6a0deef96e84232a503b5cfa488699a",
      type: "heading_2",
      heading_2: {
        text: [
          { type: "text", text: { content: "ECO SCORE: " } },
          {
            type: "equation",
            equation: { expression: `\\textsf{${value.toFixed(1)}/10}` },
          },
        ],
      },
    });
  }

  async updateExpiringSoon(items: FridgeItem[]) {
    const text = items.map((x) => {
      const days = Math.ceil(
        (x.dateExpires.getTime() - new Date().getTime()) / 86400000
      );
      return x.name + " - in " + days + " day" + (days === 1 ? "" : "s");
    });
    await this.client.blocks.update({
      block_id: "44e0a10f8bf54b66beafbdaacd9eb95e",
      type: "bulleted_list_item",
      bulleted_list_item: {
        text: [{ type: "text", text: { content: text[0] ?? " - " } }],
      },
    });
    await this.client.blocks.update({
      block_id: "c05c72335b994a8790a66ca6b6f396da",
      type: "bulleted_list_item",
      bulleted_list_item: {
        text: [{ type: "text", text: { content: text[1] ?? " - " } }],
      },
    });
    await this.client.blocks.update({
      block_id: "f74d0d37314647dea2b510d8ed4fb9b2",
      type: "bulleted_list_item",
      bulleted_list_item: {
        text: [{ type: "text", text: { content: text[2] ?? " - " } }],
      },
    });
  }
}
