const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/gofood");
    console.log("Connected!");

    const fetched_data = mongoose.connection.db.collection("food_items");
    const foodCategory = mongoose.connection.db.collection("food_category");

    const data = await fetched_data.find({}).toArray();
    const CatData = await foodCategory.find({}).toArray();

    global.food_items = data;
    global.foodCategory = CatData;
    console.log(global.food_items.length);
console.log(global.foodCategory.length);

    console.log("Data Loaded");
  } catch (err) {
    console.error("Connection error:", err);
  }
};

module.exports = mongoDB;