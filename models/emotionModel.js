const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const emotionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    emotion: {
      type: String,
      required: true,
    },
    details: {
      type: Object,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    attended: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Emotion", emotionSchema);
