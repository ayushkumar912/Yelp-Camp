const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DataBase Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  // const c =new Campground({title: 'purple field'});
    // await c.save();

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price =Math.floor(Math.random()*100)+10;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: 'https://unsplash.com/collections/XRWoial1tf4/camps',
      description: "In a fast-paced world dominated by technology and constant connectivity, the timeless allure of camping stands as a sanctuary of simplicity and serenity. Camping provides a unique opportunity to reconnect with nature, immersing oneself in the beauty of pristine landscapes and the soothing sounds of the wilderness. Surrounded by towering trees, expansive skies, and the gentle embrace of the elements, campers find solace in the simplicity of nature's embrace. Moreover, camping offers a welcome respite from the digital noise that pervades modern life. By unplugging from screens and devices, campers are able to rediscover the joy of genuine human connection, engaging in meaningful conversations and shared experiences under the open sky.",
      price
    });    
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
