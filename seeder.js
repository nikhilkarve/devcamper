const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const colors = require("colors");

dotenv.config({ path: "./config/config.env" });
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const bootcamps = JSON.parse(fs.readFileSync("./_data/bootcamps.json"));
const courses = JSON.parse(fs.readFileSync("./_data/courses.json"));

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log(`Data Imported....`.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("Data destroyed".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
