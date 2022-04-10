import { router } from "../components/router";
import { database } from "../utils/database";

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

export function init() {
  router.get("/", async (ctx) => {
    // Number of boxes per row in hero animation
    const countInRow = 28;
    // Number of rows in hero animation
    const rows = 9;

    const total = countInRow * rows;

    var gallery = await database.pickRandom(total);

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
      gallery: shuffle(gallery),
    });
  });

  router.get("/about", async (ctx) => {
    ctx.render("about.pug", {
      title: "About Us | RatsDAO",
    });
  });

  router.get("/whitepaper", async (ctx) => {
    ctx.render("whitepaper.pug", {
      title: "Whitepaper | RatsDAO",
    });
  });

  router.get("/gallery", async (ctx) => {
    return ctx.redirect("/projects");
  });

  router.get("/gallery/:project", async (ctx) => {
    const project = !isNaN(parseInt(ctx.params.project))
      ? parseInt(ctx.params.project)
      : -1;
    const projectName = await database.getProjectName(project);
    const count = await database.count(project);
    const page = 0;
    const skip = 24 * page;
    const gallery = await database.getAllNfts(project, skip, 24);

    if (project == -1 || (gallery && gallery.length === 0))
      return ctx.redirect("/projects");

    const max = Math.min(6, Math.floor(count / 24));
    var constructionPage = Math.max(Math.min(max - 3, page), 3);
    const pagination: any[] = [
      0,
      "skip",
      constructionPage - 1,
      constructionPage,
      constructionPage + 1,
      "skip",
      max,
    ];

    if (max < 5) {
      pagination[1] = 1;
      pagination.splice(max);
    } else {
      if (pagination[2] == 2) pagination[1] = 1;
      if (pagination[4] == max - 2) pagination[5] = max - 1;
      if (pagination[4] + 1 == pagination[6]) pagination.splice(5, 1);
      if (pagination[0] + 1 == pagination[2]) pagination.splice(1, 1);
    }

    ctx.render("gallery.pug", {
      title: "Gallery | RatsDAO",
      gallery: gallery,
      project: project,
      projectName: projectName,
      current: page,
      pagination: pagination,
    });
  });

  router.get("/gallery/:project/:page", async (ctx) => {
    const project = !isNaN(parseInt(ctx.params.project))
      ? parseInt(ctx.params.project)
      : -1;
    const projectName = await database.getProjectName(project);
    const count = await database.count(project);
    const page = !isNaN(parseInt(ctx.params.page))
      ? parseInt(ctx.params.page)
      : 0;
    const skip = 24 * page;
    const gallery = await database.getAllNfts(project, skip, 24);

    if (project == -1 || (gallery && gallery.length === 0))
      return ctx.redirect("/projects");

    const max = Math.min(6, Math.floor(count / 24));
    var constructionPage = Math.max(Math.min(max - 3, page), 3);
    const pagination: any[] = [
      0,
      "skip",
      constructionPage - 1,
      constructionPage,
      constructionPage + 1,
      "skip",
      max,
    ];

    if (max < 5) {
      pagination[1] = 1;
      pagination.splice(max);
    } else {
      if (pagination[2] == 2) pagination[1] = 1;
      if (pagination[4] == max - 2) pagination[5] = max - 1;
      if (pagination[4] + 1 == pagination[6]) pagination.splice(5, 1);
      if (pagination[0] + 1 == pagination[2]) pagination.splice(1, 1);
    }

    ctx.render("gallery.pug", {
      title: `Gallery | RatsDAO`,
      gallery: gallery,
      project: project,
      projectName: projectName,
      current: page,
      pagination: pagination,
    });
  });

  router.get("/projects", async (ctx) => {
    const projects = await database.getProjects();

    ctx.render("projects.pug", {
      title: "Projects | RatsDAO",
      projects: projects,
    });
  });

  router.get("/nft/:id", async (ctx) => {
    const nftId = ctx.params.id;
    const nft = await database.getNft(nftId);
    var backLink = 0;
    if (ctx.request.query && typeof ctx.request.query["p"] === "string")
      backLink = isNaN(parseInt(ctx.request.query["p"]))
        ? 0
        : parseInt(ctx.request.query["p"]);

    if (!nft) {
      return ctx.redirect("/");
    }

    ctx.render("nft.pug", {
      title: `${nft.name} | RatsDAO`,
      nft: nft,
      backLink: backLink,
    });
  });

  router.get("/humans.txt", async (ctx) => {
    ctx.body = "Made by Zachary Montgomery for RatsDAO.";
  });
}
