///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
// pull MONGODB_URL from .env
const { PORT = 3000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");


// DATABASE CONNECTION

// Establish Connection

mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Connection Events

mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));


// MODELS

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

// Middleware
app.use(cors());
app.use(morgan("dev")); 
app.use(express.json()); 


// ROUTES

// test route
app.get("/", (req, res) => {
  res.send("hello world");
});

// Index route
app.get("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

// Create route
app.post("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.create(req.body));
  } catch (error) {
    res.status(400).json(error);
  }
});

// Update route
app.put("/cheese/:id", async (req, res) => {
  try {
    res.json(
      await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

// Delete route
app.delete("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

// Index route
app.get("/cheese/:id", async (req, res) => {
    try {
      res.json(await Cheese.findById(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });


// Listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));