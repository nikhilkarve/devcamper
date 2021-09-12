const Bootcamp = require("../models/Bootcamp");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc GET Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampID/courses
// @access public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc GET Course
// @route Update /api/v1/courses/:id
// @access public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "title description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course found by id ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ success: true, data: course });
});

// @desc ADD Course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access public

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = Bootcamp.findById(req.body.bootcamp);
  if (!bootcamp) {
    return next(
      new ErrorResponse("No bootcamp found by given ID to add any course")
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @desc UPDATE Course
// @route PUT /api/v1/courses/:id
// @access public

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse("No bootcamp found by given ID to add any course")
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @desc DELETE Course
// @route DELETE /api/v1/courses/:id
// @access public

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No courses found by given id ${req.params.id}`)
    );
  }
  await course.remove();
  res.status(200).json({ success: true, data: [] });
});
