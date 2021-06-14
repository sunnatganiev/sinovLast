const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const checkUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  const today = Date.now();

  users.forEach(user => {
    user.dayLeft.getTime() === today.getTime() ? user.active === false : ''
  })
});
