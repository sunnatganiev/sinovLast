const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
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

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_END === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const createSendTokenAdmin = catchAsync(async (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_END === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.redirect("/");

  const users = await User.find();

  const today = new Date().toISOString().split("T")[0];

  users.forEach(async (user) => {
    let dayLeft = new Date(user.dayLeft).toISOString().split("T")[0];

    // dayLeft === today ? (user.active = false) : "";
    if (dayLeft === today) {
      user.active = false;
      user.dayLeft = undefined;
    }
    await user.save({ validateBeforeSave: false });
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "name",
    "phoneNumber",
    "role",
    "password"
  );
  if (req.file) filteredBody.image = req.file.filename;

  const newUser = await User.create(filteredBody);
  createSendToken(newUser, 201, res);
});

exports.signupAdmin = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "name",
    "surname",
    "phoneNumber",
    "password",
    "passwordConfirm"
  );
  if (req.file) filteredBody.image = req.file.filename;

  const newAdmin = await Admin.create(filteredBody);
  createSendTokenAdmin(newAdmin, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  // 1) Check if phone Number and password exist
  if (!phoneNumber || !password) {
    return next(new AppError("Please provide phone Number and password", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ phoneNumber }).select("+password");

  if (!user || !(await user.correctPasaword(password, user.password))) {
    return next(new AppError("Incorrect phone Number or password", 401));
  }

  // 3) If everything ok, send token to client

  createSendToken(user, 200, res);
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  // 1) Check if phone Number and password exist
  if (!phoneNumber || !password) {
    return next(new AppError("Please provide phone Number and password", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await Admin.findOne({ phoneNumber }).select("+password");

  if (!user || !(await user.correctPasaword(password, user.password))) {
    return next(new AppError("Incorrect phone Number or password", 401));
  }

  // 3) If everything ok, send token to client

  createSendTokenAdmin(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Pleaes log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restirctTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'registrator']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perfomr this action", 403)
      );
    }
    next();
  };
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;

      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

exports.isLoggedInAdmin = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if Admin still exists
      const currentAdmin = await Admin.findById(decoded.id);
      if (!currentAdmin) {
        return next();
      }

      // THERE IS A LOGGED IN Admin
      res.locals.admin = currentAdmin;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.redirect("/login");
};
