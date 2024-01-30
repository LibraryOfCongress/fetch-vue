# Fetch App

Inventory Management Software Development PWA built with Vue 3 / Pinia State Management / Quasar Framework

See [Vue 3 Docs](https://vuejs.org/guide/introduction.html)

See [Quasar Framework](https://quasar.dev/docs)

See [Pinia Docs](https://pinia.vuejs.org/getting-started.html)

&nbsp;

# Getting Started

### Main File Structure Overview
- . : Configuration files
- package.json: base project settings and packages
- quasar. : files related to quasar configuration/plugins
- vitest. : files for vitest configuration
- dist/ : Build files related to deployment
- env/ : Environment variable files and Environment Parse _(only an example file exists here since we handle this in CI/CD Pipelines)_
- images/ : Docker Container Files to build the application
- nginx/ : Handles ssl and proxying needs for deployment
- public/ : Static files or files that dont change often
- test/ : Contains (unit) tests
- src/ : FETCH Frontend Source Code
- src-pwa/ : Service Worker Setup Files and Manifest


## 1. Installing the application

You can either install the application using the quick install (uses docker and brew) or the manual install guides.

### Quick Installation (Uses a dockerized version of the app)

You will need docker and brew installed for this version to work on your pc.

Head to the [fetch-local](https://git.loc.gov/fetch/fetch-local) repo and follow instructions up to the 'run' step to get a fully working FETCH Application.

_This version will run in pwa mode by default if you need spa mode manual installation is recommended._

### Manual installation Guide

**1. Clone the repository into your local branch using git (make sure you have ssh access beforehand)**

```bash
git clone ssh://git@git.loc.gov:7999/fetch/vue.git
```

**2. Install the dependencies**

```bash
yarn
# or
npm install
```

**3. Start the app in your desired development mode (SPA, PWA, Local env, Dev env, etc.)**

```bash
# start with either quasar or npm followed by dev and the environment you want to run

# spa mode
quasar dev:local
# or 
npm run dev:local

# pwa mode
quasar dev:local-pwa
# or 
npm run dev:local-pwa

```
## 2. Creating new components or views

This application is built using Vue 3's composition api, which gets rid of a lot of the organization that the options api uses. In order to prevent disorganized code structure and make files easy to follow. We have a template file to be used as a starting point for any new views or components. This template file has defined commented code blocks to be used as guidlines for where certain code or logic belongs.

**The template file can be found in the _src/pages/example_ folder under the name _StarterTemplate.vue_**

## 3. Handling API Calls

_If running the local environment make sure you have a .env.local file created under the env folder and that is where you'll define your local api url along with any other variables we have access to which can be found in the env.exmaple file_

### Adding and Referencing api calls
Api calls can be added and referenced under the _src/http_ folder where you will see a js file named after the api its endpoints will be under (ex: inventoryService.js)

### Sending api requests
All api requests are stored and called from a related pinia store file, these are found under _src/stores_. 

When adding api calls try to follow the current naming conventions (naming your action function starting with the api request type ex: postTrayItems, patchTrayItems, getTrayItems, deleteTrayItems, ect)

_Please do not call api requests from a component/view_



## 4. Linting files (this is automatically handled during pre-commit)

Make sure you have pre-commit installed or the auto linting wont work.
To install pre-commit run the following:
```bash
brew install pre-commit
# then run this at the vue root folder
pre-commit install
```

If you'd like to manually lint and format you can use these commands.

**Lint the files (uses eslint ruleset along with vue standard rules)**

```bash
npm run lint
```

**Lint and Format the files**

```bash
npm run lint:fix
```

## 5. Unit Testing

Unit tests are located in the test/vitest folder and are required anytime you create a new composable or global component. Dont worry about testing views or view specific components as these are not isolated pieces of code and do not require unit tests.

### Run unit tests using the following commands

```bash
# runs a continuous testing suite with a watcher
npm run test:unit

# or for one time tests
npm run test:unit:ci
```

## 6. Building and Testing The PWA App On Mobile / Desktop

The best way to handle testing the PWA portion of the application will require an external hosting server/service which is needed so our dev url can have an ssl cert (pwa's can only run on https). For this guide we will use ngrok. (there are other services and ways which can be found in quasar's documentation link below)

### 1. Run the local build script

```bash
quasar build:local
```

This will build the app in pwa mode and store the built files under ./dist/pwa

### 2. Serve the built files using quasars CLI

```bash
quasar serve ./dist/pwa/ --history
```

This should start a local server at http://127.0.0.1:4000 (sometimes the pwa will load on desktop with just this url even though its not https, however to load the app on mobile we still need an external url)

### 3. Start Ngrok and create a proxy url at port 4000 or whichever port your local server is using

```bash
ngrok http 4000
```

You should now see a proxy url generated in ngrok which should look something like the following:
'https://b92a-47-221-215-243.ngrok-free.app'

Using that url you can now load the application on mobile or desktop and pwa service workers should be active and running.

You should now be able to test out any pwa related functionality within the application!

**Helpful Related Quasar PWA Links:**


See [Exposing Dev Server to Public](https://quasar.dev/quasar-cli-vite/opening-dev-server-to-public/).

See [Quasar PWA With Vite](https://quasar.dev/quasar-cli-vite/developing-pwa/introduction).

