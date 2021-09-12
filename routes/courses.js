const express = require("express");
const { protected, authorized } = require("../middleware/auth");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protected, authorized("publisher", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protected, authorized("publisher", "admin"), updateCourse)
  .delete(protected, authorized("publisher", "admin"), deleteCourse);
module.exports = router;
