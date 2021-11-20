import { Client } from "@notionhq/client";
import { env } from "./env";
import { getDateString } from "./util";

type FridgeItem = {
  name: string;
  coverImg: string;
  datePurchased: Date;
  dateExpires: Date;
};
type IngredientItem = {
  name: string;
  coverImg: string;
  shelfLife: number;
  ecoScore: number;
};
type RecipeItem = {
  name: string;
  coverImg: string;
  pageId: string;
  ingredients: string[];
};

export class Notion {
  client: Client;
  constructor() {
    console.log("Creating Notion Client");
    this.client = new Client({ auth: env.token });
  }

  async readFridge(): Promise<FridgeItem[]> {
    const res = await this.client.databases.query({
      database_id: "74b5da5eb496408885b033a1c3f6fa37",
    });
    console.log(res);
    return res.results.map((x: any) => {
      const name = x.properties.Name.title[0]?.text.content;
      const coverImg = x.properties.cover.external?.url;
      const datePurchased = new Date(x.properties["Date Purchased"].date.start);
      const dateExpires = new Date(x.properties["Date Expires"].date.start);
      return { name, coverImg, datePurchased, dateExpires };
    });
  }
  async insertFridge(item: FridgeItem) {
    await this.client.pages.create({
      parent: { database_id: "74b5da5eb496408885b033a1c3f6fa37" },
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
      database_id: "74b5da5eb496408885b033a1c3f6fa37",
      filter: {
        property: "Name",
        text: {
          contains: name,
        },
      },
    });
    for (const page of res.results) {
      await this.client.pages.update({ page_id: page.id, archived: true });
    }
  }
  async deleteAllFridge() {
    const res = await this.client.databases.query({
      database_id: "74b5da5eb496408885b033a1c3f6fa37",
    });
    for (const page of res.results) {
      await this.client.pages.update({ page_id: page.id, archived: true });
    }
  }

  async readRecipes(): Promise<RecipeItem[]> {
    const res = await this.client.databases.query({
      database_id: "05e7bfbfae114199b78c341c03801939",
    });
    return res.results.map((x: any) => {
      const name = x.properties.Name.title[0]?.text.content;
      const pageId = x.id;
      const ingredients = x.properties.Ingredients.rich_text[0]?.text.content
        .split(",")
        .map((x: any) => x.trim());
      return { name, pageId, ingredients };
    });
  }
  // async insertRecipe(item: RecipeItem) {
  //   const ingredients = item.ingredients.join(", ");
  //   await this.client.pages.create({
  //     parent: { database_id: "05e7bfbfae114199b78c341c03801939" },
  //     properties: {
  //       Name: {
  //         title: [{ text: { content: item.name } }],
  //       },
  //       Ingredients: {
  //         rich_text: [{ type: "text", text: { content: ingredients } }],
  //       },
  //     },
  //   });
  // }
  // async deleteRecipe(name: string) {
  //   const res = await this.client.databases.query({
  //     database_id: "05e7bfbfae114199b78c341c03801939",
  //     filter: {
  //       property: "Name",
  //       text: {
  //         equals: name,
  //       },
  //     },
  //   });
  //   for (const page of res.results) {
  //     await this.client.pages.update({ page_id: page.id, archived: true });
  //   }
  // }
  // async deleteAllRecipes() {
  //   const res = await this.client.databases.query({
  //     database_id: "05e7bfbfae114199b78c341c03801939",
  //   });
  //   for (const page of res.results) {
  //     await this.client.pages.update({ page_id: page.id, archived: true });
  //   }
  // }
  async readIngredients(): Promise<IngredientItem[]> {
    const res = await this.client.databases.query({
      database_id: "d7dd5f1c39c149f4a3c34957f69aec9b",
    });
    return res.results.map((x: any) => {
      const name = x.properties.Name.title[0]?.text.content;
      const shelfLife = x.properties["Shelf Life"].number;
      const ecoScore = x.properties["Eco Score"].number;
      return { name, shelfLife, ecoScore };
    });
  }
}
