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
}): Promise<boolean> {
  try {
    const dir = path.join(process.env.PWD!, "static/img/nft");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const check_filename = path.join(dir, `${name}`);
    const check_smallfilename = path.join(dir, `small_${name}`);
    const check_avifsmallfilename = path.join(dir, `avif_small_${name}.avif`);

    if (
      (await checkFileExists(check_filename)) &&
      (await checkFileExists(check_smallfilename)) &&
      (await checkFileExists(check_avifsmallfilename))
    )
      return false;

    http
      .get(url, async (response) => {
        const filename = path.join(dir, `${name}`);
        const smallfilename = path.join(dir, `small_${name}`);
        const avifsmallfilename = path.join(dir, `avif_small_${name}.avif`);

        var file = fs.createWriteStream(filename);

        response.pipe(file);

        file.on("finish", async () => {
          try {
            const avif = await sharp(file.path);
            await avif.resize({ width: 256 });
            await avif.avif({ lossless: true });
            await avif.toFile(avifsmallfilename);

            const small = await sharp(file.path);
            await small.resize({ width: 256 });
            await small.toFile(smallfilename);
          } catch (err) {
            console.log(err);
          } finally {
            file.close();
          }
        });
      })
      .on("error", (e) => {
        console.error(e);
      });

    return true;
  } catch (err) {
    console.error(err);

    return false;
  }
}

export async function checkValid(name: string): Promise<boolean> {
  const dir = path.join(process.env.PWD!, "static/img/nft");

  const link = path.join(dir, `${name}`);
  const smalllink = path.join(dir, `small_${name}`);
  const aviflink = path.join(dir, `avif_small_${name}.avif`);

  const image = sharp(link);
  const smallimage = sharp(smalllink);
  const avifimage = sharp(aviflink);

  try {
    image.stats();
    smallimage.stats();
    avifimage.stats();
  } catch (err) {
    return false;
  }

  return true;
}

export async function deleteFile(name: number | string): Promise<boolean> {
  try {
    const dir = path.join(process.env.PWD!, "static/img/nft");

    if (!fs.existsSync(dir)) {
      return false;
    }

    const filename = path.join(dir, `${name}`);
    const smallfilename = path.join(dir, `small_${name}`);
    const avifsmallfilename = path.join(dir, `avif_small_${name}.avif`);

    if (await checkFileExists(filename)) {
      fs.unlink(filename, function (err) {
        if (err) return console.error(err);
      });
    }

    if (await checkFileExists(smallfilename)) {
      fs.unlink(smallfilename, function (err) {
        if (err) return console.error(err);
      });
    }

    if (await checkFileExists(avifsmallfilename)) {
      fs.unlink(avifsmallfilename, function (err) {
        if (err) return console.error(err);
      });
    }

    return true;
  } catch (err) {
    return false;
  }
}
