const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const reklamaController = require("../controllers/reklamaController");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/register.html", viewsController.register);

router.get("/login.html", viewsController.login);

router.get("/logout", authController.logout);

router.post("/register.html", authController.signupAdmin);

router.post("/login.html", authController.loginAdmin);

router.use(authController.isLoggedInAdmin);

router.get("/", viewsController.dashboard);

router.get("/index.html", viewsController.dashboard);

router.get("/subscribers.html", viewsController.subscribers);

router.post("delete/:id", userController.deleteUser);

router.get("/live-football.html", viewsController.liveFootball);

router.get("/add-live.html", viewsController.addLive);

router.post("/add-live.html", viewsController.setliveFootball);

router.get("/reklama.html", viewsController.reklama);

router.get("/add-reklama.html", viewsController.addReklama);

router.post(
  "/add-reklama.html",
  reklamaController.uploadReklama,
  reklamaController.createReklama
);

router.post(
  "/",
  viewsController.uploadPhoto,
  viewsController.resizePhotoLive,
  viewsController.setliveFootball
);

router.get("/teams.html", viewsController.getTeams);

router.get("/add-team.html", viewsController.addTeams);

router.post(
  "/add-team.html",
  viewsController.uploadPhoto,
  viewsController.resizePhoto,
  viewsController.addTeam
);

router.get("/news.html", viewsController.getNews);
router.get("/add-news.html", viewsController.goAddNews);
router.post(
  "/add-news.html",
  viewsController.uploadPhoto,
  viewsController.resizePhotoNews,
  viewsController.addNews
);

router.get("/edit-user.html/:id", viewsController.editSubscribers);

router.post(
  "/edit-user.html/:id",
  viewsController.uploadPhoto,
  viewsController.resizePhotoUser,
  viewsController.editSubscriber
);

module.exports = router;
