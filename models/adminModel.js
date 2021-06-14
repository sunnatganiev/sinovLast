const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Iltimos ismingizni kirgizing!"],
  },
  surname: String,
  image: String,
  phoneNumber: {
    type: String,
    required: [true, "Iltimos telefon raqam kirgizing!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

adminSchema.methods.correctPasaword = async function (
  candidatePassword,
  userPassword
) {
  return await (candidatePassword === userPassword && true);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
