const express = require("express");
const { register, login, getMe } = require("../controllers/auth");
const router = express.Router();

const { protected } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protected, getMe);

module.exports = router;
