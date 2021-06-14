const multer = require("multer");
const News = require("../models/newsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files/news");
  },
  filename: (req, file, cb) => {
    // user-23rfsdfw3-12344321.jpeg
    const ext = file.mimetype.split("/")[1];
    cb(null, `news-${Date.now()}.${ext}`);
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

exports.uploadNews = upload.single("image");

exports.createNews = catchAsync(async (req, res, next) => {
  console.log("NewsController line 34: ", req.file);

  const createObj = filterObj(req.body, "title", "content");

  if (req.file) createObj.image = req.file.filename;

  const newNews = await News.create(createObj);

  res.status(201).json({
    status: "success",
    data: {
      team: newNews,
    },
  });
});

exports.getAllNews = catchAsync(async (req, res, next) => {
  const allNews = await News.find();
  // Tour.findOne({ _id: req.params.id })

  if (!allNews) {
    return next(new AppError("No news found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      allNews,
    },
  });
});

exports.getNews = catchAsync(async (req, res, next) => {
  const news = await News.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!news) {
    return next(new AppError("No news found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      news,
    },
  });
});

exports.updateNews = catchAsync(async (req, res, next) => {
  console.log("newsController line 83: ", req.file);
  const updateObj = filterObj(req.body, "title", "content");

  if (req.file) updateObj.image = req.file.filename;

  const updatedNews = await News.findByIdAndUpdate(req.params.id, updateObj, {
    new: true,
    runValidators: true,
  });

  if (!updatedNews) {
    return next(new AppError("No news found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      team: updatedNews,
    },
  });
});

exports.deleteNews = catchAsync(async (req, res, next) => {
  const news = await News.findByIdAndDelete(req.params.id);

  if (!news) {
    return next(new AppError("No news found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
