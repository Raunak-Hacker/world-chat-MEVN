var mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { corsOptions } = require("./corsOptions.js");
var router = require("express").Router();
var bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
const Joi = require("joi");

router.use(cors(corsOptions));
//Whenever request is made to this router, this function will be called
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });
// 404 error

const chatSchema = new mongoose.Schema({
  name: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

// const chatModel = mongoose.model("chats", chatSchema);
const models = {
  africa: mongoose.model("africa", chatSchema),
  asia: mongoose.model("asia", chatSchema),
  europe: mongoose.model("europe", chatSchema),
  america: mongoose.model("america", chatSchema),
  australia: mongoose.model("australia", chatSchema),
};

function getModelForContinent(continent) {
  const Model = models[continent];
  if (!Model) {
    throw new Error(`No model found for continent`);
  }
  return Model;
}

const chatValidationSchema = Joi.object({
  name: Joi.string().required(),
  message: Joi.string().required(),
  continent: Joi.string().required(),
});

router.post("/chat-add", (req, res) => {
  // Validate request body against schema
  const { error } = chatValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => {
      return {
        field: err.path[0],
        message: err.message,
      };
    });
    return res.status(400).send({ errors });
  }
  try {
    const continent = req.body.continent;
    const Model = getModelForContinent(continent);
    const chat = new Model({
      name: req.body.name,
      message: req.body.message,
    });
    chat.validate((err) => {
      if (err) {
        const errors = Object.values(err.errors).map((error) => {
          return {
            field: error.path,
            message: error.message,
          };
        });
        return res.status(400).send({ errors });
      }
      chat.save((err, chat) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Internal server error" });
        }
        res.send({ status: 200, message: "Message sent successfully" });
      });
    });
  } catch (error) {
    return res.status(404).send({
      status: 400,
      message: error.message,
    });
  }
});

// Define the home page route
router.get("/", function (req, res) {
  const msg = { msg: "Unlocked!" };
  return res.send(msg);
});

router.get("/chat/:continent", async function (req, res) {
  // console.log("req.params.continent");
  try {
    const { continent } = req.params;
    const Model = getModelForContinent(continent);
    const chats = await Model.find().exec();
    res.send(chats);
  } catch (error) {
    return res.status(404).send({
      status: 404,
      message: "Sorry can't find that!",
    });
  }
  // get chats from the continent
});

router.use(function (_, res) {
  res.status(404).send({
    status: 404,
    message: "Sorry can't find that!",
  });
});

module.exports = router;
