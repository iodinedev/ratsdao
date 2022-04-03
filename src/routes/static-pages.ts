import { router } from "../components/router";
import { database } from "../utils/database";

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function init() {
  router.get("/", async (ctx) => {
    // Number of boxes per row in hero animation
    const countInRow = 28;
    // Number of rows in hero animation
    const rows = 9;

    const total = countInRow * rows;

    var gallery = await database.getAllNfts(total);

    if (!gallery) {
      gallery = new Array(total);
    }

    if (gallery.length < total) {
      var i = gallery.length;
      var curr = 0;

      while (i < total) {
        gallery.push(gallery[curr]);

        curr++;
        i++;
      }
    }

    ctx.render("index.pug", {
      title: "Home | RatsDAO",
      heroClass: true,
      gallery: shuffle(gallery)
    });
  });

  router.get("/whitepaper", async (ctx) => {
    ctx.render("whitepaper.pug", {
      title: "Whitepaper | RatsDAO",
    });
  });

  router.get("/gallery", async (ctx) => {
    const gallery = await database.getAllNfts();

    ctx.render("gallery.pug", {
      title: "Gallery | RatsDAO",
      gallery: gallery
    });
  });

  router.get("/humans.txt", async (ctx) => {
    ctx.body = "Made by Zachary Montgomery for Rat's DAO.";
  });
}
