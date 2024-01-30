const dotenv = require('dotenv')

let files
if (process.env.ENVIRONMENT == 'local') {
  // load using parsed env files from the env folder
  files = {
    ...dotenv.config({ path: 'env/.env' }).parsed,
    ...dotenv.config({ path: `env/.env.${process.env.ENVIRONMENT}` }).parsed
  }
}

module.exports = () => {
  Object.keys(files, (key) => {
    if (typeof files[key] !== 'string') {
      files[key] = JSON.stringify(files[key])
    }
  })
  return files
}