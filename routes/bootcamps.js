const express = require("express");
const { protected, authorized } = require("../middleware/auth");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

//Writing resource routers
const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");
const courseRouter = require("./courses");
const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/:id/photo")
  .put(protected, authorized("publisher", "admin"), bootcampPhotoUpload);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protected, authorized("publisher", "admin"), createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protected, authorized("publisher", "admin"), updateBootcamp)
  .delete(protected, authorized("publisher", "admin"), deleteBootcamp);

module.exports = router;
