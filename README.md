# Fetch App

Inventory Management Software Development PWA built using the Quasar Framework

See below for quick install (uses docker) or manual install guides



## Quick Installation (Uses a dockerized version of the app)

You will need docker installed for this version to work on your pc

## Clone the repository into your local branch using git (make sure you have ssh access beforehand)

```bash
git clone ssh://git@git.loc.gov:7999/fetch/vue.git
```

## Just run the helper.sh script and thats it!

```bash
./helper.sh start
```

### To build the app for production with debugging to test

```bash
./helper.sh build
```

## Manual installation Guide

## Clone the repository into your local branch using git (make sure you have ssh access beforehand)

```bash
git clone ssh://git@git.loc.gov:7999/fetch/vue.git
```

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev:local
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Lint and Format the files

```bash
yarn lint:fix
# or
npm run lint:fix
```

### Run Unit Tests

```bash
yarn test:unit
# or
npm run test:unit

# or for one time tests
yarn test:unit:ci
# or
npm run test:unit:ci
```

### Build the app for production with debugging to test

```bash
quasar build:local
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
