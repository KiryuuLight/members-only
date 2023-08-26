const mongoose = require('mongoose');

const initializeConnection = (url) => {
  mongoose.set('strictQuery', false);

  async function main() {
    await mongoose.connect(url);
    console.log('DB CONNECTED');
  }

  main().catch((err) => console.log(err));
};

module.exports = initializeConnection;
