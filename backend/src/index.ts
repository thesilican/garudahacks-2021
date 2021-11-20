import { ArduinoInterface } from "./arduino";
import { Notion } from "./notion";

async function main() {
  require("util").inspect.defaultOptions.depth = null;
  // const arduino = new ArduinoInterface();

  // arduino.onLine((line) => {
  //   arduino.writeLine(line);
  // });

  const notion = new Notion();
  // for (let i = 0; i < 3; i++) {
  //   await notion.insertFridge({
  //     name: "Banana",
  //     dateExpired: new Date(),
  //     datePurchased: new Date(),
  //   });
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
  await notion.deleteAllRecipes();
}
main();
