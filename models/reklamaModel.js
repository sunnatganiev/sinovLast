const mongoose = require("mongoose");

const reklamaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Iltimos sarlavha kirgizing!"],
  },
  video: {
    type: String,
    required: [true, "Iltimos file kirgizing!"],
  },
  link: {
    type: String,
    required: [true, "Iltimos reklama linkini kirgizing!"],
  },
});

const Reklama = mongoose.model("Reklama", reklamaSchema);

module.exports = Reklama;
