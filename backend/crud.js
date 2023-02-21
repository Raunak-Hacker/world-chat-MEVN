var mongoose = require("mongoose");
require("dotenv").config();
const Joi = require("joi");

const chatSchema = new mongoose.Schema({
  name: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

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

async function addChat(body) {
  const { error } = chatValidationSchema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => {
      return {
        field: err.path[0],
        message: err.message,
      };
    });
    return errors;
  }

  try {
    const continent = body.continent;
    const Model = getModelForContinent(continent);
    const chat = new Model({
      name: body.name,
      message: body.message,
    });
    const validateError = await chat.validate();
    if (validateError) {
      const errors = Object.values(validateError.errors).map((error) => {
        return {
          field: error.path,
          message: error.message,
        };
      });
      return errors;
    }
    const savedChat = await chat.save();
    return savedChat;
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function getChats(continent) {
  const Model = getModelForContinent(continent);
  const chats = await Model.find().exec();
  return chats;
}

module.exports = { getChats, addChat };
