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


### Testing The PWA App On Mobile / Desktop

The best way to handle testing the PWA portion of the application will require an external hosting server/service which is needed so our dev url can have an ssl cert (pwa's can only run on https). For this guide we will use ngrok. (there are other services and ways which can be found in quasar's documentation link below)

**1. Run the local build script**

```bash
quasar build:local
```

This will build the app in pwa mode and store the built files under ./dist/pwa

**2. Serve the built files using quasars CLI**

```bash
quasar serve ./dist/pwa/ --history
```

This should start a local server at http://127.0.0.1:4000 (sometimes the pwa will load on desktop with just this url even though its not https, however to load the app on mobile we still need an external url)

**3. Start Ngrok and create a proxy url at port 4000 or whichever port your local server is using**

```bash
ngrok http 4000
```

You should now see a proxy url generated in ngrok which should look something like the following:
'https://b92a-47-221-215-243.ngrok-free.app'

Using that url you can now load the application on mobile or desktop and pwa service workers should be active and running.

You should now be able to test out any pwa related functionality within the application!

Helpful Related Quasar PWA Links:
See [Exposing Dev Server to Public](https://quasar.dev/quasar-cli-vite/opening-dev-server-to-public/).
See [Quasar PWA With Vite](https://quasar.dev/quasar-cli-vite/developing-pwa/introduction).

