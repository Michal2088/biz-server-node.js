const express = require("express");
const joi = require("joi");
const { Card } = require("../models/Card");
const _ = require("lodash");
const auth = require("../middlewares/auth");

const router = express.Router();

const cardSchema = joi.object({
  bizName: joi.string().required().min(2),
  bizAddress: joi.string().required().min(2),
  bizDescription: joi.string().required().min(2),
  bizPhone: joi
    .string()
    .required()
    .regex(/^0[2-9]\d{7,8}$/),
  bizImage: joi.string().required(),
});

let genCardNumber = async () => {
  while (true) {
    let randomNum = _.random(1000, 999999);
    let card = await Card.findOne({ cardNumber: randomNum });
    if (!card) return randomNum;
  }
};

router.post("/", auth, async (req, res) => {
  try {
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let card = new Card(req.body);
    card.cardNumber = await genCardNumber();
    card.user_id = req.payload._id;

    await card.save();
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send("error in add card");
  }
});

//תשובה לשאלה מספר 8

router.get("/my-cards", auth, async (req, res) => {
  try {
    let myCards = await Card.find({
      user_id: req.payload._id,
    });
    res.status(200).send(myCards);
  } catch (error) {
    res.status(400).send("error in get user cards");
  }
});

//תשובה לשאלה מספר 9
router.get("/", async (req, res) => {
  try {
    let allCards = await Card.find();
    res.status(200).send(allCards);
  } catch (error) {
    res.status(400).send("error in get all cards");
  }
});

router.get("/:_id", auth, async (req, res) => {
  try {
    let card = await Card.findOne({
      _id: req.params._id,
      user_id: req.payload._id,
    });
    if (!card) return res.status(404).send("card was not found");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("error in get specific card");
  }
});



router.put("/:_id", auth, async (req, res) => {
  try {
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);
    let card = await Card.findOneAndUpdate(
      { _id: req.params._id, user_id: req.payload._id },
      req.body,
      { new: true }
    );
    if (!card) return res.status(404).send("card was not found");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("error in update specific card");
  }
});

router.delete("/:_id", auth, async (req, res) => {
  try {
    let card = await Card.findOneAndRemove({
      _id: req.params._id,
      user_id: req.payload._id,
    });
    if (!card) return res.status(404).send("card was not found");
    res.status(200).send("card was deleted");
  } catch (error) {
    res.status(400).send("error in delete specific card");
  }
});


module.exports = router;
