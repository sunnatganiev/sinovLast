const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Iltimos ismingizni kirgizing!"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Iltimos telefon raqam kirgizing!"],
    trim: true,
  },
  image: String,
  role: {
    type: String,
    enum: ["admin", "client"],
    default: "client",
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
  },
  active: {
    type: Boolean,
    default: false,
  },
  dayLeft: {
    type: Date,
    default: 0,
  },
});

userSchema.methods.correctPasaword = async function (
  candidatePassword,
  userPassword
) {
  return await (candidatePassword === userPassword && true);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
