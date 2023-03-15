const express = require("express");

const {
  getAll,
  setEmotion,
  getEmotionsCount,
  changeAttended,
  getByEmotion,
  unresoleved,
} = require("../controllers/emotionController");

const router = express.Router();

router.get("/", getAll);
router.post("/", setEmotion);
router.get("/count", getEmotionsCount);
router.post("/attended", changeAttended);
router.post("/getByEmotion", getByEmotion);
router.get("/unresoleved", unresoleved);

module.exports = router;
