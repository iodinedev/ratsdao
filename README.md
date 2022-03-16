# NPHA Site

This is the source code for [nphvac.com](https://www.nphvac.com/).

- **Language:** TypeScript
- **Main libraries:** [prisma](https://www.npmjs.com/package/prisma), [koa](https://www.npmjs.com/package/koa), [pug](https://www.npmjs.com/package/handlebars)
- **Database:** PostgreSQL

## Running

- **External dependencies**
  - Install PostgreSQL.
- **Installation**
  - Install node v14 and yarn (`npm i -g yarn`)
  - Install dependencies using `yarn`
  - Install the database client using `yarn prisma generate`
  - Build using `yarn build`
- **Configuration**
  - Copy `.env.example` to `.env` and fill it in
- **Running**
  - **In development only:**
    - Use `yarn prisma db push` to synchronize the database schema. Everytime
      you change the schema (`database/schema.prisma`), run this command again.
    - Run using `yarn start` or run with a watcher using `yarn watch`
  - **In production only:**
    - Use `yarn prisma migrate` to run pending migrations
    - Run using `node dist`