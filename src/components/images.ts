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

    http.get(url, async (response) => {

      const filename = path.join(dir, `${name}`);
      const smallfilename = path.join(dir, `small_${name}`);

      var file = fs.createWriteStream(filename);

      response.pipe(file);

      file.on("finish", function () {
        sharp(file.path)
          .resize({ width: 300 })
          .withMetadata()
          .toFile(smallfilename);
        file.close();
      });
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
