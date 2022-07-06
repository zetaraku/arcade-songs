# arcade-songs

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c32f773-3a20-42a1-a8f7-ace6ec1a3ebc/deploy-status)](https://app.netlify.com/sites/arcade-songs/deploys) [![Coding Style](https://img.shields.io/badge/code_style-airbnb-%234B32C3)](https://github.com/airbnb/javascript) [![Gitmoji](https://img.shields.io/badge/commit_style-%20😜%20😍-%23FFDD67)](https://gitmoji.dev)

A utility site that provides a searching interface for arcade games songs and sheets.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Setup

```sh
# install dependencies
yarn install
```

- Make a copy of the `.env.example` file as `.env` and fill out the required fields.

## Development

```sh
# serve with hot reload at localhost
yarn run dev

# serve with hot reload on local network
yarn run dev:host
```

- For a detailed explanation of each directory, check out the [Nuxt documentation](https://nuxtjs.org).

## Build for production

```sh
# generate static project
$ yarn run generate
```

- This project is not ready for Server-Side Rendering (SSR), do not use the `yarn run build` and `yarn run start` scripts.

## Data Source

See: <https://github.com/zetaraku/arcade-songs-fetch>

## Contributing

The translations for **Japanese** and **Simplified Chinese** need to be refined, and I am also planning to add the **Korean** translation but I don't understand Korean.

If you are familiar with these languages, you can help improve the translation by [opening an issue](https://github.com/zetaraku/arcade-songs/issues) or [creating a pull request](https://github.com/zetaraku/arcade-songs/pulls). The translation files are located in `locales/`.

If you have any ideas or suggestions, you can [open an issue](https://github.com/zetaraku/arcade-songs/issues) or [use the ask form](https://arcade-songs-report.zetaraku.dev/). Improvement to the code is welcome.

## License

Copyright © 2022 Raku Zeta.

Licensed under the [MIT License](./LICENSE).
