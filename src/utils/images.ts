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
}): Promise<void> {
  const dir = path.join(__dirname, "../../static/img/nft");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filename = path.join(dir, `${name}.jpg`);
  const smallfilename = path.join(dir, `${name}.s.jpg`);

  if (await checkFileExists(filename)) return;

  var file = fs.createWriteStream(filename);

  http.get(url, function (response) {
    response.pipe(file);

    file.on("finish", function () {
      sharp(file.path)
        .resize({ width: 600 })
        .withMetadata()
        .toFile(smallfilename);
      file.close();
    });
  });
}

export async function deleteFile(name: number | string): Promise<void> {
  const dir = path.join(process.env.PWD!, "static/img/nft");

  if (!fs.existsSync(dir)) {
    return;
  }

  const filename = path.join(dir, `${name}.jpg`);
  const smallfilename = path.join(dir, `${name}.s.jpg`);

  if (!(await checkFileExists(filename))) return;
  if (!(await checkFileExists(smallfilename))) return;

  fs.unlink(filename, function (err) {
    if (err) console.error(err);
  });

  fs.unlink(smallfilename, function (err) {
    if (err) return console.error(err);
  });
}
