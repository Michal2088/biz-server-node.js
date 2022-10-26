const express = require("express");
const { User } = require("../models/User");
const _ = require("lodash");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);
    //הוספתי את השורה הבאה אחרי הפרוייקט שעשינו ביחד באנגולר
    if (!user) return res.status(400).send("Error in get profile")
    res.status(200).send(_.pick(user, ["name", "biz"]));
  } catch (error) {
    res.status(400).send(error)
  }
});

module.exports = router;
