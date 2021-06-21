const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Team = require("../models/teamModel");
const Live = require("../models/liveModel");
const News = require("../models/newsModel");
const Reklama = require("../models/reklamaModel");
const Admin = require("../models/adminModel");

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

exports.uploadPhoto = upload.single("image");

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
  const users = await User.find();
  const subsCount = await User.count({ active: true });
  const adminsCount = await Admin.count();
  res.status(200).render("index", {
    title: "Dashboard",
    admin: res.locals.admin,
    users,
    subsCount,
    adminsCount,
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

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toDateString();
  }

  if (req.body.active && req.body.active === "true") {
    filteredBody.dayLeft = addDays(day, 8);
  }

  if (req.file) filteredBody.image = req.file.filename;

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).render("edit-user", {
    title: "Users",
    user,
  });
});

exports.editSubscribers = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id);
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
  console.log("hi");
  try {
    const lives = await Live.find().populate("teams");
    console.log(lives);
    res.status(200).render("match", {
      title: "live",
      lives,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.addLive = catchAsync(async (req, res) => {
  const teams = await Team.find();
  res.status(200).render("add-live", {
    title: "live",
    teams,
  });
});

exports.setliveFootball = catchAsync(async (req, res) => {
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
  res.status(200).render("teams", {
    title: "live",
    teams,
  });
});

exports.addTeam = catchAsync(async (req, res) => {
  const filteredBody = filterObj(req.body, "name");
  if (req.file) filteredBody.image = req.file.filename;

  await Team.create(filteredBody);

  res.status(200).render("add-team", {
    title: "teams",
  });
});

exports.showTeam = catchAsync(async (req, res) => {
  const team = await Team.findById(req.params.id);
  res.status(200).render("show-team", {
    team,
  });
});

exports.editTeam = catchAsync(async (req, res) => {
  const teamObj = req.body;
  console.log(req.file);
  if (req.file) teamObj.image = req.file.filename;
  console.log(teamObj);
  try {
    await Team.findByIdAndUpdate(req.body.id, teamObj);
  } catch (error) {
    console.log(error);
  }

  res.redirect(`/teams/id/${teamObj.id}`);
});

exports.getNews = catchAsync(async (req, res) => {
  const news = await News.find();
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

exports.showNews = catchAsync(async (req, res) => {
  const news = await News.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!news) {
    return next(new AppError("No news found with that ID", 404));
  }

  res.status(200).render(`show-news`, {
    news,
  });
});

exports.editNews = catchAsync(async (req, res, next) => {
  const updateObj = req.body;

  if (req.file) updateObj.image = req.file.filename;

  const updatedNews = await News.findByIdAndUpdate(updateObj.id, updateObj);

  if (!updatedNews) {
    return next(new AppError("No news found with that ID", 404));
  }

  res.redirect(`/news/id/${updatedNews._id}`);
});

exports.addNews = catchAsync(async (req, res) => {
  const filteredBody = filterObj(req.body, "title", "content");
  if (req.file) filteredBody.image = req.file.filename;
  const news = await News.create(filteredBody);

  res.redirect(`/news/id/${news._id}`);
});

exports.deleteNews = catchAsync(async (req, res) => {
  const news = await News.findByIdAndDelete(req.body.id);

  if (!news) {
    return next(new AppError("No news found with that ID", 404));
  }

  res.redirect(`/news`);
});
