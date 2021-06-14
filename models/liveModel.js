const mongoose = require("mongoose");
const Team = require("./teamModel");

const matchSchema = new mongoose.Schema({
  chempionat: {
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
  matchTime: Date,
  teams: Array,
});

matchSchema.index({ chempionat: 1 });

matchSchema.pre("save", async function (next) {
  const teamsPromise = this.teams.map(async (id) => await Team.findById(id));
  this.teams = await Promise.all(teamsPromise);
  next();
});

const Live = mongoose.model("Live", matchSchema);

module.exports = Live;
