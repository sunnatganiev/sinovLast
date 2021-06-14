const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Iltimos sarlavha kirgizing!"],
  },
  image: {
    type: String,
  },
  content: {
    type: String,
    required: [true, "Iltimos content kirgizing"],
  },
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
