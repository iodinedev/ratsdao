import http from "https";
import fs from "fs";
import { URL } from "url";
import sharp from "sharp";
import path from "path";

function checkFileExists(file) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

export async function download({
  url,
  name,
}: {
  url: string | http.RequestOptions | URL;
  name: string;
}, error?: boolean): Promise<boolean> {
  try {
    const dir = path.join(process.env.PWD!, "static/img/nft");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    http.get(url, async (response) => {
      const filename = path.join(dir, `${name}`);
      const smallfilename = path.join(dir, `small_${name}`);
      const avifsmallfilename = path.join(dir, `avif_small_${name}.avif`);

      var file = fs.createWriteStream(filename);

      response.pipe(file);

      file.on("finish", async () => {
        try {
          const avif = await sharp(file.path);
          await avif.resize({ width: 512 })
          await avif.avif()
          await avif.withMetadata()
          await avif.toFile(avifsmallfilename);

          const small = await sharp(file.path)
          await small.resize({ width: 256 })
          await small.withMetadata()
          await small.toFile(smallfilename);
        } catch(err) {
          console.log(`${url} had an error!`)
          console.log(err);
        } finally {
          file.close();
        }
      })
    }).on("error", (e) => {
      if (!error) {
        setTimeout(async () => { await download({url: url, name: name}, true) }, 5 * 60 * 1000);
      } else {
        console.log(`${url} had an error!`)
        console.error(e);
      }
    });

    return true;
  } catch (err) {
    console.error(err);

    return false;
  }
}

export async function deleteFile(name: number | string): Promise<boolean> {
  try {
    const dir = path.join(process.env.PWD!, "static/img/nft");

    if (!fs.existsSync(dir)) {
      return false;
    }

    const filename = path.join(dir, `${name}.png`);
    const smallfilename = path.join(dir, `${name}.s.png`);

    if (!(await checkFileExists(filename))) return false;
    if (!(await checkFileExists(smallfilename))) return false;

    fs.unlink(filename, function (err) {
      if (err) return console.error(err);
    });

    fs.unlink(smallfilename, function (err) {
      if (err) return console.error(err);
    });

    return true;
  } catch (err) {
    return false;
  }
}
