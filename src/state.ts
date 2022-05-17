import { database } from "./utils/database";

var gallery = "";

export async function getGallery(): Promise<string> {
  if (!gallery) await updateGallery();

  return gallery;
}

export async function updateGallery() {
  // Update the homepage gallery

  // Number of boxes per row in hero animation
  const countInRow = 28;
  // Number of rows in hero animation
  const rows = 9;

  const totalGallery = countInRow * rows;

  var dbGallery = await database.pickRandom(totalGallery);

  if (!dbGallery) {
    dbGallery = new Array(totalGallery);
  }

  if (dbGallery.length < totalGallery) {
    var i = dbGallery.length;
    var curr = 0;

    while (i < totalGallery) {
      dbGallery.push(dbGallery[curr]);

      curr++;
      i++;
    }
  }
  
  gallery = await generateHtml(shuffle(dbGallery));
}

async function generateHtml(gallery): Promise<string> {
  var final: string[] = [];

  const count = 12;
  var rows = 8;
  var current = 0;
  
  while (rows >= 0) {
    var n = 0;

    final.push("<div class=\"main\">");
    final.push("<div></div>");

    while(n < count) {
      final.push("<div class=\"box\">");
      if (gallery && gallery[current]) {
        final.push("<picture>");
        final.push(`<source srcset="/img/nft/avif_small_${gallery[current].id}.avif", type="image/avif">`);
        final.push(`<img src="/img/nft/small_${gallery[current].id}", alt="", onerror="this.onerror=null;this.src='/img/examplenft.png';">`);
        final.push("</picture>");
      }
      // End .box
      final.push("</div>");

      current++;
      n++;
    }

    current -= count;

    while (n < count*2) {
      final.push("<div class=\"box\">");
      if (gallery && gallery[current]) {
        final.push("<picture>");
        final.push(`<source srcset="/img/nft/avif_small_${gallery[current].id}.avif", type="image/avif">`);
        final.push(`<img src="/img/nft/small_${gallery[current].id}", alt="", onerror="this.onerror=null;this.src='/img/examplenft.png';">`);
        final.push("</picture>");
      }
      // End .box
      final.push("</div>");

      current++;
      n++;
    }

    // End .main
    final.push("</div>");

    rows--;
  }
  
  return final.join("");
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}