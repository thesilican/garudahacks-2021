import { ArduinoInterface } from "./arduino";
import {
  FridgeItem,
  IngredientItem,
  Notion,
  RecipeItem,
  StoreItem,
} from "./notion";
import util from "util";
import { HTTPServer } from "./server";
import { getDateString } from "./util";

async function main() {
  util.inspect.defaultOptions.depth = null;

  const notion = new Notion();
  let fridge: FridgeItem[] = [];
  let ingredients: IngredientItem[] = [];
  let recipes: RecipeItem[] = [];
  let stores: StoreItem[] = [];
  let ecoScore: number = 0;
  let expiring: FridgeItem[] = [];
  let expiringState: string = "green";

  setInterval(async () => {
    // Read up to date info from notion
    [fridge, ingredients, recipes, stores] = await Promise.all([
      notion.readFridge(),
      notion.readIngredients(),
      notion.readRecipes(),
      notion.readStores(),
    ]);

    const promises: Promise<any>[] = [];

    // Calculate eco score
    ecoScore = 0;
    for (const item of fridge) {
      const ingredient = ingredients.find((x) => x.name === item.name);
      if (!ingredient) {
        throw "up";
      }
    }
    promises.push(notion.updateEcoScore(ecoScore));

    // Calculate food that is expiring soon
    // < 1 day = red
    // < 3 days = yellow
    // >= 3 days = green
    const msPerDay = 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    expiring = fridge
      .slice()
      .filter((x) => now - x.dateExpires.getTime() < 3 * msPerDay)
      .sort((a, b) => a.dateExpires.getTime() - b.dateExpires.getTime());
    if (fridge.find((x) => now - x.dateExpires.getTime() < 1 * msPerDay)) {
      expiringState = "red";
    } else if (
      fridge.find((x) => now - x.dateExpires.getTime() < 3 * msPerDay)
    ) {
      expiringState = "yellow";
    } else {
      expiringState = "green";
    }
    promises.push(notion.updateExpiringSoon(expiring.slice(0, 3)));

    const NUM_TO_RECOMMEND = 3;

    // Recommendation algorithm to determine what recipes to recommend
    // Based on:
    //  - number of recipe ingredients that you have in your fridge
    //  - number of recipe ingredients that you have and is expiring soon
    //  - recipe eco score
    type SortedRecipeItem = { recipe: RecipeItem; score: number };
    const sortedRecipes: SortedRecipeItem[] = [];
    for (const recipe of recipes) {
      const haveIngredients = recipe.ingredients.filter((x) =>
        fridge.find((f) => f.name === x)
      ).length;
      const totalIngredients = recipe.ingredients.length;
      const percentIngredients = haveIngredients / totalIngredients;

      const ecoScore = recipe.ecoScore;

      const expiring = recipe.ingredients.filter((x) =>
        fridge.find(
          (f) => f.name === x && now - f.dateExpires.getTime() < 3 * msPerDay
        )
      ).length;

      const score = percentIngredients * 20 + ecoScore * 1 + expiring * 5;
      sortedRecipes.push({ recipe, score });
    }
    sortedRecipes.sort((a, b) => b.score - a.score);
    promises.push(
      // Read recipes
      notion.readRecipes().then((recipes) =>
        // Then recommend the best recipies from sortedRecipes
        Promise.all(
          recipes.map((recipe) => {
            const name = recipe.name;
            const index = sortedRecipes
              .slice(0, NUM_TO_RECOMMEND)
              .findIndex((x) => x.recipe.name === name);
            return notion.updateRecipe(name, index !== -1);
          })
        )
      )
    );

    // Recommendation algorithm to determine what stores to recommend
    // Based on:
    //  - number of ingredients that the store has that you are missing (for a recipe)
    //  - eco score of store
    type SortedStoreItem = { store: StoreItem; score: number };
    const sortedStores: SortedStoreItem[] = [];
    const missingIngredients: string[] = [];
    for (const recipe of sortedRecipes.slice(0, NUM_TO_RECOMMEND)) {
      for (const ingredient of recipe.recipe.ingredients) {
        const result = fridge.find((x) => x.name === ingredient);
        if (!result) {
          missingIngredients.push(ingredient);
        }
      }
    }
    for (const store of stores) {
      const missingIngredientCount = missingIngredients.filter((x) =>
        store.stock.includes(x)
      ).length;
      const ecoScore = store.ecoScore;
      const score = missingIngredientCount * 15 + ecoScore;
      sortedStores.push({ store, score });
    }
    sortedStores.sort((a, b) => b.score - a.score);
    promises.push(
      // Read read stores
      notion.readStores().then((stores) =>
        // Then recommend the best stores from sortedStores
        Promise.all(
          stores.map((store) => {
            const name = store.name;
            const index = sortedStores
              .slice(0, NUM_TO_RECOMMEND)
              .findIndex((x) => x.store.name === name);
            return notion.updateRecipe(name, index !== -1);
          })
        )
      )
    );

    await Promise.all(promises);
  }, 5000);

  // Arduino Interface
  const arduino = new ArduinoInterface();
  arduino.onLine((line) => {
    if (line === "get.reqxpString") {
      if (expiring.length > 0) {
        const text = expiring.map((x) => x.name).join(", ");
        arduino.writeLine(text);
      } else {
        arduino.writeLine("No foods expiring soon");
      }
    } else if (line === "get.reqDate") {
      const date = getDateString(new Date());
      arduino.writeLine(date);
    } else if (line === "get.reqTime") {
      const raw = new Date().toTimeString();
      const time = raw.match(/(\d\d:\d\d).+/)![1];
      arduino.writeLine(time);
    } else if (line === "get.reqEcoScore") {
      arduino.writeLine(ecoScore.toFixed(1));
    } else if (line === "get.LEDstate") {
      arduino.writeLine(expiringState);
    }
  });

  // HTTP Server
  // (to connect with mobile QR scanner)
  const server = new HTTPServer();
  server.onRequest((req) => {
    const { name, command } = req;
    if (command === "add") {
      // Add item
      const ingredient = ingredients.find((x) => x.name === name);
      if (!ingredient) {
        // Could not find ingredient
        console.log("Invalid request name: ", name);
        return false;
      }
      const purchased = new Date();
      const expires = new Date(purchased);
      expires.setDate(purchased.getDate() + ingredient.shelfLife);

      notion.insertFridge({
        name,
        coverImg: ingredient.coverImg,
        datePurchased: purchased,
        dateExpires: expires,
      });
      return true;
    } else if (command === "remove") {
      notion.deleteFridge(name);
      return true;
    } else {
      console.log("Invalid request command: ", command);
      return false;
    }
  });
}
main();
