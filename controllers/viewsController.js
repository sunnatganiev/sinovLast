const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Team = require("../models/teamModel");
const Live = require("../models/liveModel");
const News = require("../models/newsModel");
const Reklama = require("../models/reklamaModel");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single("file");

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `team-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/files/team/${req.file.filename}`);

  next();
});

exports.resizePhotoNews = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `news-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/files/news/${req.file.filename}`);

  next();
});

exports.resizePhotoLive = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `live-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/files/live/${req.file.filename}`);

  next();
});

exports.resizePhotoUser = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `users-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/files/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.dashboard = catchAsync(async (req, res) => {
  // console.log("viewsController line 6: ", res);
  const users = await User.find();
  res.status(200).render("index", {
    title: "Dashboard",
    admin: res.locals.admin,
    users,
  });
});

exports.subscribers = catchAsync(async (req, res) => {
  // 1) Get user data from collection
  const users = await User.find();

  // 2) Build template

  // 3) Render that template using user data from 1)
  res.status(200).render("subscribers", {
    title: "Subscribers",
    users,
  });
});

exports.deleteSubscribers = catchAsync(async (req, res) => {
  // 1) Get user data from collection
  const users = await User.find();

  // 2) Build template

  // 3) Render that template using user data from 1)
  res.status(200).render("subscribers", {
    title: "Subscribers",
    users,
  });
});

exports.editSubscriber = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "name",
    "phoneNumber",
    "active",
    "dayLeft"
  );

  const day = new Date();
  console.log(day.toDateString());

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    console.log("viewsController line 128: ", result.toDateString());
    return result.toDateString();
  }

  console.log(req.body.active);

  if (req.body.active && req.body.active === "true") {
    console.log(addDays(day, 0));
    filteredBody.dayLeft = addDays(day, 8);
    console.log("viewsController line 138: ", filteredBody);
  }

  if (req.file) filteredBody.image = req.file.filename;

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  console.log(user);
  res.status(200).render("edit-user", {
    title: "Users",
    user,
  });
});

exports.editSubscribers = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id);
  console.log("viewsController line 158: ", user);
  if (!user) return next(new AppError("No user found with that ID"));

  res.status(200).render("edit-user", {
    title: "Users",
    user,
  });
});

exports.login = (req, res) => {
  res.status(200).render("login", {
    title: "Login",
  });
};

exports.register = (req, res) => {
  res.status(200).render("register", {
    title: "Register",
  });
};

exports.payment = (req, res) => {
  res.status(200).render("payments", {
    title: "Payments",
  });
};

exports.liveFootball = catchAsync(async (req, res) => {
  const lives = await Live.find();
  console.log("viewsController line 156: ", lives);
  res.status(200).render("match", {
    title: "live",
    lives,
  });
});

exports.addLive = catchAsync(async (req, res) => {
  const teams = await Team.find();
  res.status(200).render("add-live", {
    title: "live",
    teams,
  });
});

exports.setliveFootball = catchAsync(async (req, res) => {
  const filteredBody = filterObj(
    req.body,
    "chempionat",
    "content",
    "matchTime",
    "teams"
  );

  if (req.file) filteredBody.image = req.file.filename;
  const match = await Live.create(filteredBody);
  console.log("viewsController line 174: ", match);
  res.status(200).render("live-football", {
    title: "live",
    match,
  });
});

exports.addTeams = (req, res) => {
  res.status(200).render("add-team", {
    title: "teams",
  });
};

exports.getTeams = catchAsync(async (req, res) => {
  const teams = await Team.find();
  console.log("viewsController line 197: ", teams);
  res.status(200).render("teams", {
    title: "live",
    teams,
  });
});

exports.addTeam = catchAsync(async (req, res) => {
  const filteredBody = filterObj(req.body, "name");
  console.log(req.body);
  if (req.file) filteredBody.image = req.file.filename;

  console.log(filteredBody);

  await Team.create(filteredBody);

  res.status(200).render("add-team", {
    title: "teams",
  });
});

exports.getNews = catchAsync(async (req, res) => {
  const news = await News.find();
  console.log(news);
  res.status(200).render("news", {
    title: "news",
    news,
  });
});

exports.goAddNews = (req, res) => {
  res.status(200).render("add-news", {
    title: "news",
  });
};

exports.reklama = catchAsync(async (req, res) => {
  const reklama = await Reklama.find();
  res.status(200).render("reklama", {
    title: "reklama",
    reklama,
  });
});

exports.addReklama = (req, res) => {
  res.status(200).render("add-reklama", {
    title: "add-reklama",
  });
};

exports.addNews = catchAsync(async (req, res) => {
  const filteredBody = filterObj(req.body, "title", "content");
  if (req.file) filteredBody.image = req.file.filename;
  await News.create(filteredBody);

  res.status(200).render("add-news", {
    title: "news",
  });
});
