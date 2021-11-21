import { ArduinoInterface } from "./arduino";
import { Notion } from "./notion";
import util from "util";
import { HTTPServer } from "./server";

const COVER_IMGS = {
  banana:
    "https://images.unsplash.com/photo-1561058325-8c99b449e3b6?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
};

async function main() {
  util.inspect.defaultOptions.depth = null;

  // const server = new HTTPServer();
  // const arduino = new ArduinoInterface();

  // arduino.onLine((line) => {
  //   if (line === "time") {
  //     arduino.writeLine(new Date().toTimeString());
  //   }
  // });

  const notion = new Notion();
  await notion.updateExpiringSoon(["1", "2", "3"]);
  // console.log(await notion.updateStore("CeilingMart", true));
  // console.log(await notion.readRecipes());
  // console.log(await notion.readFridge());
  // for (let i = 0; i < 3; i++) {
  // await notion.insertFridge({
  //   name: "Banana",
  //   coverImg: COVER_IMGS.banana,
  //   dateExpires: new Date(),
  //   datePurchased: new Date(),
  // });
  // }
  // notion.deleteFridge("Apple");
  // notion.deleteAllFridge();
  // console.log(await notion.readFridge());

  // console.log(await notion.readRecipes());
  // await notion.insertRecipe({
  //   name: "My recipe",
  //   pageId: "",
  //   ingredients: ["Happy", "Meal"],
  // });
  // await notion.deleteRecipe("Apple Pie");
  // await notion.deleteAllRecipes();
}
main();
