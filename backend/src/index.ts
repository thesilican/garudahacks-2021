import { ArduinoInterface } from "./arduino";
import { Notion } from "./notion";
import util from "util";
import { HTTPServer } from "./server";
import { getDateString } from "./util";

const COVER_IMGS = {
  banana:
    "https://images.unsplash.com/photo-1561058325-8c99b449e3b6?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
};

async function main() {
  util.inspect.defaultOptions.depth = null;

  // const server = new HTTPServer();
  const arduino = new ArduinoInterface();

  arduino.onLine((line) => {
    if (line === "get.reqxpString") {
      const ITEMS = [
        "YOUR MILK IS EXPIRING DUMMY",
        "YOUR EGGS ARE EXPIRING DUMMY",
        "rip your spinach it is expiring",
      ];
      const index = Math.floor(new Date().getTime() / 10000) % ITEMS.length;
      arduino.writeLine(ITEMS[index]);
    } else if (line === "get.reqDate") {
      const date = getDateString(new Date());
      arduino.writeLine(date);
    } else if (line === "get.reqTime") {
      const raw = new Date().toTimeString();
      const time = raw.match(/(\d\d:\d\d).+/)![1];
      arduino.writeLine(time);
    } else if (line === "get.reqEcoScore") {
      const score = Math.floor(new Date().getTime() / 5000) % 10;
      arduino.writeLine(score.toString());
    } else if (line === "get.LEDstate") {
      const index = Math.floor(new Date().getTime() / 5000) % 3;
      arduino.writeLine(["red", "green", "yellow"][index]);
    }
  });

  // const notion = new Notion();
  // await notion.updateEcoScore(Math.PI);
  // await notion.updateExpiringSoon(["Fish - Today"]);
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
