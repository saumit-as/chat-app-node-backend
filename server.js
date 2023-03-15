require("dotenv").config();
const bodyParser = require("body-parser");
const emotionRoutes = require("./routes/emotionRoute");
const { default: mongoose } = require("mongoose");

const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const translate = require("google-translate-api-x");
app.use("/db/emotions/", emotionRoutes);
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen port no
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB && Listing at port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

app.post("/translate", async (req, res) => {
  console.log(req.body.string);

  const rets = await translate(req.body.string, { to: "en" });
  console.log(rets.text);

  res.status(200).json(rets.text);
});
app.post("/emotion", async (req, res) => {
  console.log(req.body.message);

  const rets = await axios.post(
    "https://python-chat-app-backend-v3.azurewebsites.net/emotion",
    req.body.message
  );

  const emotes = {
    Happy: "😂",
    Sad: "😔",
    Fear: "😨",
    Surprise: "😲",
    Angry: "🤬",
  };
  console.log(emotes[rets.data]);

  res.status(200).json(emotes[rets.data]);
});
