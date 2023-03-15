const Emotion = require("../models/emotionModel");
const mongoose = require("mongoose");
const { default: axios } = require("axios");

const getAll = async (req, res) => {
  try {
    const emotions = await Emotion.find({}).sort({ createdAt: -1 });
    res.status(200).json({ emotions: emotions });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
};
const getByEmotion = async (req, res) => {
  const emotion = req.body.emotion;
  try {
    const emotions = await Emotion.find({ emotion: emotion }).sort({
      createdAt: -1,
    });
    res.status(200).json({ emotions: emotions });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
};

const setEmotion = async (req, res) => {
  const details = req.body.details;
  const name = req.body.details.displayName;
  const uid = req.body.details.uid;
  const ae = await Emotion.find({ uid: uid });
  console.log(req.body.message);

  const rets = await axios.post(
    "https://python-chat-app-backend-v3.azurewebsites.net/emotion",
    req.body.message
  );

  // const summary = await axios.post(
  //   "https://python-chat-app-backend-v3.azurewebsites.net/summary",
  //   req.body.message
  // );
  // console.log(summary.data);

  const emotes = {
    Happy: "😂",
    Sad: "😔",
    Fear: "😨",
    Surprise: "😲",
    Angry: "🤬",
    Neutral: "😑",
  };
  const emotion = rets.data;
  const emoji = emotes[rets.data];
  if (!ae.length > 0) {
    // console.log(emotes[rets.data]);

    try {
      const emotionData = await Emotion.create({
        name,
        uid,
        emotion,
        emoji,
        details,
      });

      res.status(200).json(emotionData);
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  } else {
    const emotionData = await Emotion.findOneAndUpdate(
      { uid: uid },
      { emotion: emotion, emoji: emoji }
    );
    console.log(emotionData);
    res.status(200).json(emotionData);
  }
};

const getEmotionsCount = async (req, res) => {
  let emotionsCount = {
    Happy: 0,
    Sad: 0,
    Angry: 0,
    Surprise: 0,
    Neutral: 0,
    Fear: 0,
  };

  var query = await Emotion.find({});

  for (const key in query) {
    if (Object.hasOwnProperty.call(query, key)) {
      const element = query[key];
      emotionsCount[element["emotion"]] += 1;
    }
  }
  res.status(200).json(emotionsCount);
};

const changeAttended = async (req, res) => {
  const uid = req.body.uid;
  const attended = req.body.attended;
  const emotionData = await Emotion.findOneAndUpdate(
    { uid: uid },
    { attended: attended }
  );
  res.status(200).json(emotionData);
};
const unresoleved = async (req, res) => {
  console.log("----------");

  const emotionData = await Emotion.find({});
  const d = emotionData.filter((data) => data.attended);
  const resolvedCount = d.length;
  const UnResolvedCount = emotionData.length - d.length;

  res
    .status(200)
    .json({ resolvedCount: resolvedCount, UnResolvedCount: UnResolvedCount });
};

module.exports = {
  getAll,
  setEmotion,
  getEmotionsCount,
  changeAttended,
  getByEmotion,
  unresoleved,
};
