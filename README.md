# NPHA Site

This is the source code for [nphvac.com](https://www.nphvac.com/).

- **Language:** TypeScript
- **Main libraries:** [koa](https://www.npmjs.com/package/koa), [pug](https://www.npmjs.com/package/handlebars)
- **Database:** PostgreSQL

## Running

- **External dependencies**
  - Install PostgreSQL.
- **Installation**
  - Install node v14 and yarn (`npm i -g yarn`)
  - Install dependencies using `yarn`
  - Build using `yarn build`
- **Configuration**
  - Copy `.env.example` to `.env` and fill it in
- **Running**
  - **In development only:**
    - Run using  `yarn watch`
  - **In production only:**
    - Run using `yarn start`