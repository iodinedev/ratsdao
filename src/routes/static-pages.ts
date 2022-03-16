import { router } from "../components/router";
import { contactService } from "../services/contact.service";
import { PublicError } from "../components/sentry";
import { getDbNfts, getDbNft, getNftAddress } from "../components/nft";
import { verify } from "hcaptcha";

export function init() {
  router.get("/", async (ctx) => {
    ctx.render("index.pug", {
      title: "Home | RatsDAO",
      heroClass: true,
    });
  });

  router.get("/whitepaper", async (ctx) => {
    ctx.render("whitepaper.pug", {
      title: "Whitepaper | RatsDAO",
    });
  });

  router.get("/faq", async (ctx) => {
    ctx.render("faq.pug", {
      title: "FAQ | RatsDAO",
    });
  });

  router.get("/gallery", async (ctx) => {
    ctx.render("gallery.pug", {
      title: "Gallery | RatsDAO",
    });
  });

  router.get("/press", async (ctx) => {
    ctx.render("press.pug", {
      title: "Press | RatsDAO",
    });
  });

  router.get("/humans.txt", async (ctx) => {
    ctx.body = "Made by Zachary Montgomery for Rat's DAO.";
  });
}
