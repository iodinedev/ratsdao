# NPHA Site

This is the source code for [ratsdao.io](https://ratsdao.io/).

- **Language:** TypeScript
- **Main libraries:** [koa](https://www.npmjs.com/package/koa), [pug](https://www.npmjs.com/package/handlebars), [prisma](https://www.npmjs.com/package/prisma)
- **Database:** PostgreSQL

## Running

- **External dependencies**
  - Install PostgreSQL.
- **Installation**
  - Install node v16 and yarn (`npm i -g yarn`)
  - Install dependencies using `yarn`
  - Build using `yarn build`
- **Configuration**
  - Copy `.env.example` to `.env` and fill it in
- **Running**
  - **In development only:**
    - Run using  `yarn watch`
  - **In production only:**
    - Install PM2 `npm i -g pm2`
    - Run using `pm2 start`