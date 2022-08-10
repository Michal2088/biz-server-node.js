const express = require("express");
const joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

const registerSchema = joi.object({
  name: joi.string().required().min(2).max(1024),
  email: joi.string().required().min(10).max(1024).email(),
  password: joi.string().required().min(8).max(1024),
  biz: joi.boolean().required(),
});

router.post("/", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("user already exit");
    user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const genToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.secretKey
    );
    res.status(201).send({ token: genToken });
  } catch (error) {
    res.status(400).send("error in register");
  }
});

module.exports = router;
