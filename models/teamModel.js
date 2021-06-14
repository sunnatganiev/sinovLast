const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Iltimos Jamoa nomini kirgizing!"],
  },
  image: {
    type: String,
  }
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
