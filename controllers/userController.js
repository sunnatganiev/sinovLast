const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { counter } = require("./logicController");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     // user-23rfsdfw3-12344321.jpeg
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images!", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadUserPhoto = upload.single("image");

exports.resizeUserPhoto = (req, res, next) => {
  if (!req || !req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/files/users/${req.file.filename}`);

  next();
};

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // Tour.findOne({ _id: req.params.id })

  if (!users) {
    return next(new AppError("No user found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "name", "phoneNumber", "password");
  if (req.file) filteredBody.image = req.file.filename;

  const day = Date.now();

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    console.log("userController line 99: ", result);
    return result;
  }

  if (req.body.active && req.body.active === true) {
    filteredBody.dayLeft = addDays(day, 7);
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  console.log("userController line 126: ", req.params);
  await User.findByIdAndDelete(req.params.id);

  res.status(204).redirect("./subscribers.html");
});
