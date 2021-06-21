const multer = require("multer");
const Live = require("../models/liveModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Team = require("../models/teamModel");

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
  console.log(req.body);
  const createObj = filterObj(
    req.body,
    "chempionat",
    "content",
    "matchDate",
    "matchTime",
    "teams"
  );

  if (req.file) createObj.image = req.file.filename;

  try {
    const newLive = await Live.create(createObj);
    res.redirect(`/live-football/id/${newLive._id}`);
  } catch (error) {
    res.json(error);
  }
});

exports.editLive = catchAsync(async (req, res, next) => {
  const editObj = filterObj(
    req.body,
    "chempionat",
    "content",
    "matchDate",
    "matchTime",
    "teams"
  );

  if (req.file) editObj.image = req.file.filename;
  try {
    const updatedLive = await Live.findByIdAndUpdate(req.body.id, editObj);
    res.redirect(`/live-football/id/${updatedLive._id}`);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

exports.deleteLive = catchAsync(async (req, res, next) => {
  console.log(req.body.id);
  try {
    await Live.findByIdAndDelete(req.body.id);
    res.redirect("/live-football");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

exports.showLive = catchAsync(async (req, res, next) => {
  const live = await Live.findById(req.params.id).populate("teams");
  const teams = await Team.find();
  res.status(200).render("show-live", {
    live,
    teams,
  });
});

exports.getLives = catchAsync(async (req, res, next) => {
  const lives = await Live.find().populate("teams");
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
  const live = await Live.findById(req.params.id).populate("teams");
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

// exports.deleteLive = catchAsync(async (req, res, next) => {
//   const live = await Live.findByIdAndDelete(req.params.id);

//   if (!live) {
//     return next(new AppError("No live found with that ID", 404));
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });
