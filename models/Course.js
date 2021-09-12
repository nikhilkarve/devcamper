const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please enter title"],
  },

  description: {
    type: String,
    required: [true, "Please add address"],
  },

  weeks: {
    type: String,
    required: [true, "Please add weeks"],
  },

  tuition: {
    type: Number,
    required: [true, "Please add tuition fee"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a skill level"],
    enum: ["beginner", "intermediate", "expert"],
  },
  scholarship: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

// Statis method to getAVerage of course tutions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    { $group: { _id: "$bootcamp", averageCost: { $avg: "$tuition" } } },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {}
};

CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
