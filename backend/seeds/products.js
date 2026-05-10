const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("../models/Product");

dotenv.config();

/*
========================================
CONNECT DATABASE
========================================
*/

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/*
========================================
DUMMY PRODUCTS
========================================
*/

const products = [
  {
    name: "Fresh Cow Milk",
    description: "Pure farm fresh cow milk",
    category: "Milk",
    price: 60,
    stock: 100,
    image: "assets/images/milk.jpg",
    featured: true,
  },
  {
    name: "Organic Paneer",
    description: "Soft and fresh paneer",
    category: "Paneer",
    price: 120,
    stock: 50,
    image: "assets/images/paneer.jpg",
    featured: true,
  },
  {
    name: "Desi Ghee",
    description: "Premium quality desi ghee",
    category: "Ghee",
    price: 650,
    stock: 30,
    image: "assets/images/ghee.jpg",
    featured: true,
  },
  {
    name: "Fresh Butter",
    description: "Creamy dairy butter",
    category: "Butter",
    price: 250,
    stock: 40,
    image: "assets/images/butter.jpg",
    featured: false,
  },
];

/*
========================================
SEED FUNCTION
========================================
*/

const seedProducts = async () => {
  try {
    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products Seeded Successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedProducts();
