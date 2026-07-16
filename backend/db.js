const mongoose = require('mongoose');

const mongoDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/gofood');
    console.log('Connected!');
  } catch (err) {
    console.error('Connection error:', err);
  }
};

module.exports = mongoDB;