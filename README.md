# Fetch App

Inventory Management Software Development PWA built using the Quasar Framework

See below for quick install (uses docker) or manual install guides



## Quick Installation (Uses a dockerized version of the app)

You will need docker installed for this version to work on your pc

**1. Clone the repository into your local branch using git (make sure you have ssh access beforehand)**

```bash
git clone ssh://git@git.loc.gov:7999/fetch/vue.git
```

**2. Just run the helper.sh script and thats it!**

```bash
./helper.sh start
```

### build the app for production with debugging to test

```bash
./helper.sh build
```

## Manual installation Guide

**1. Clone the repository into your local branch using git (make sure you have ssh access beforehand)**

```bash
git clone ssh://git@git.loc.gov:7999/fetch/vue.git
```

**2. **Install the dependencies**

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev:local
# or 
npm run dev:local

// additionally if you'd like to run in pwa mode just add -pwa to then end
// ex: dev:local-pwa
```

### Lint the files (uses eslint ruleset along with vue standard rules)

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


### Testing The PWA App On Mobile

See [Exposing Dev Server to Public](https://quasar.dev/quasar-cli-vite/opening-dev-server-to-public/).

