const dotenv = require('dotenv');

const files = {
  ...dotenv.config({ path: 'env/.env' }).parsed,
  ...dotenv.config({ path: `env/.env.${process.env.ENVIRONMENT}` }).parsed,
};

module.exports = () => {
  Object.keys(files, (key) => {
    if (typeof files[key] !== 'string') {
      files[key] = JSON.stringify(files[key]);
    }
  });
  return files;
};