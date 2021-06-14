const multer = require("multer");
const Live = require("../models/liveModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files/live");
  },
  filename: (req, file, cb) => {
    // user-23rfsdfw3-12344321.jpeg
    const ext = file.mimetype.split("/")[1];
    cb(null, `live-${Date.now()}.${ext}`);
  },
});

// const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadLive = upload.single("image");

exports.createLive = catchAsync(async (req, res, next) => {
  const createObj = filterObj(
    req.body,
    "chempionat",
    "content",
    "matchTime",
    "teams"
  );

  if (req.file) createObj.image = req.file.filename;
  console.log(createObj)
  const newLive = await Live.create(createObj);
  res.status(201).json({
    status: "success",
    data: {
      live: newLive,
    },
  });
});

exports.getLives = catchAsync(async (req, res, next) => {
  const lives = await Live.find();
  // Tour.findOne({ _id: req.params.id })

  if (!lives) {
    return next(new AppError("No ad found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      lives,
    },
  });
});

exports.getLive = catchAsync(async (req, res, next) => {
  const live = await Live.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!live) {
    return next(new AppError("No live found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      live,
    },
  });
});

exports.updateLive = catchAsync(async (req, res, next) => {
  const updateObj = filterObj(req.body, "title", "content");

  if (req.file) updateObj.image = req.file.filename;

  const updatedLive = await Live.findByIdAndUpdate(req.params.id, updateObj, {
    new: true,
    runValidators: true,
  });

  if (!updatedLive) {
    return next(new AppError("No live found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      live: updatedLive,
    },
  });
});

exports.deleteLive = catchAsync(async (req, res, next) => {
  const live = await Live.findByIdAndDelete(req.params.id);

  if (!live) {
    return next(new AppError("No live found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
