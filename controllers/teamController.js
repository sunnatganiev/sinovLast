const multer = require("multer");
const Team = require("../models/teamModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files/team");
  },
  filename: (req, file, cb) => {
    // user-23rfsdfw3-12344321.jpeg
    const ext = file.mimetype.split("/")[1];
    cb(null, `team-${Date.now()}.${ext}`);
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

exports.uploadTeam = upload.single("image");

exports.createTeam = catchAsync(async (req, res, next) => {
  console.log("TeamControl line 43: ", req.file);

  const createObj = filterObj(req.body, "name", "content");

  if (req.file) createObj.image = req.file.filename;

  const newTeam = await Team.create(createObj);

  res.status(201).json({
    status: "success",
    data: {
      team: newTeam,
    },
  });
});

exports.getAllTeam = catchAsync(async (req, res, next) => {
  const teams = await Team.find();
  // Tour.findOne({ _id: req.params.id })

  if (!teams) {
    return next(new AppError("No team found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      teams,
    },
  });
});

exports.getTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!team) {
    return next(new AppError("No team found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
});

exports.updateTeam = catchAsync(async (req, res, next) => {
  // console.log("userController line 55", req.file);
  // console.log("userController line 56", req.body);
  console.log("liveControl line 85: ", req.file);
  const updateObj = filterObj(req.body, "name", "content");

  if (req.file) updateObj.image = req.file.filename;

  const updatedTeam = await Team.findByIdAndUpdate(req.params.id, updateObj, {
    new: true,
    runValidators: true,
  });

  if (!updatedTeam) {
    return next(new AppError("No team found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      team: updatedTeam,
    },
  });
});

exports.deleteTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findByIdAndDelete(req.params.id);

  if (!team) {
    return next(new AppError("No team found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
