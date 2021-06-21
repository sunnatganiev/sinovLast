const multer = require("multer");
const Reklama = require("../models/reklamaModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files/reklama");
  },
  filename: (req, file, cb) => {
    // user-23rfsdfw3-12344321.jpeg
    const ext = file.mimetype.split("/")[1];
    cb(null, `reklama-${Date.now()}.${ext}`);
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

exports.uploadReklama = upload.single("video");

exports.createReklama = catchAsync(async (req, res, next) => {
  const createObj = filterObj(req.body, "title", "link");

  if (req.file) createObj.video = req.file.filename;

  const newReklama = await Reklama.create(createObj);

  res.redirect(`/reklama/id/${newReklama._id}`);
});

exports.getReklamas = catchAsync(async (req, res, next) => {
  const reklamas = await Reklama.find();
  // Tour.findOne({ _id: req.params.id })

  if (!reklamas) {
    return next(new AppError("No ad found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      reklamas,
    },
  });
});

exports.showReklama = catchAsync(async (req, res, next) => {
  const reklama = await Reklama.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!reklama) {
    return next(new AppError("No ad found with that ID", 404));
  }

  res.status(200).render("show-reklama", {
    reklama,
  });
});

exports.getReklama = catchAsync(async (req, res, next) => {
  const reklama = await Reklama.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!reklama) {
    return next(new AppError("No ad found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      reklama,
    },
  });
});

exports.updateReklama = catchAsync(async (req, res, next) => {
  const updateObj = filterObj(req.body, "title", "link");

  if (req.file) updateObj.video = req.file.filename;

  const updatedReklama = await Reklama.findByIdAndUpdate(
    req.body.id,
    updateObj,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedReklama) {
    return next(new AppError("No ad found with that ID", 404));
  }

  res.redirect(`/reklama/id/${updatedReklama._id}`);
});

exports.deleteReklama = catchAsync(async (req, res, next) => {
  const reklama = await Reklama.findByIdAndDelete(req.body.id);

  if (!reklama) {
    return next(new AppError("No ad found with that ID", 404));
  }

  res.redirect("/reklama");
});
