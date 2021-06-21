const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const reklamaController = require("../controllers/reklamaController");
const userController = require("../controllers/userController");
const {
  createLive,
  uploadLive,
  showLive,
  editLive,
  deleteLive,
} = require("../controllers/liveController");
const { uploadTeam, deleteTeam } = require("../controllers/teamController");

const router = express.Router();

router.get("/register", viewsController.register);

router.get("/login", viewsController.login);

router.get("/logout", authController.logout);

router.post("/register", authController.signupAdmin);

router.post("/login", authController.loginAdmin);

router.use(authController.isLoggedInAdmin);

router.get("/", viewsController.dashboard);

router.get("/index", viewsController.dashboard);

router.get("/subscribers", viewsController.subscribers);

router.post("delete/:id", userController.deleteUser);

router.get("/reklama", viewsController.reklama);

//MATCH
router.get("/live-football", viewsController.liveFootball);
router.get("/add-live", viewsController.addLive);
router.get("/live-football/id/:id", showLive);
router.post("/add-live/add", uploadLive, createLive);
router.post("/live-football/edit", uploadLive, editLive);
router.post("/live-football/delete", deleteLive);

//TEAM
router.get("/teams", viewsController.getTeams);
router.get("/add-team", viewsController.addTeams);
router.get("/teams/id/:id", viewsController.showTeam);
router.post(
  "/teams/edit",
  viewsController.uploadPhoto,
  viewsController.resizePhoto,
  viewsController.editTeam
);
router.post("/teams/delete", deleteTeam);
router.post(
  "/add-team/add",
  viewsController.uploadPhoto,
  viewsController.resizePhoto,
  viewsController.addTeam
);

//NEWS
router.get("/news", viewsController.getNews);
router.get("/add-news", viewsController.goAddNews);
router.get("/news/id/:id", viewsController.showNews);
router.post(
  "/news/add",
  viewsController.uploadPhoto,
  viewsController.resizePhotoNews,
  viewsController.addNews
);
router.post(
  "/news/edit",
  viewsController.uploadPhoto,
  viewsController.resizePhotoNews,
  viewsController.editNews
);
router.post("/news/delete", viewsController.deleteNews);

//REKLAMA
router.get("/add-reklama", viewsController.addReklama);
router.get("/reklama/id/:id", reklamaController.showReklama);
router.post(
  "/reklama/add",
  reklamaController.uploadReklama,
  reklamaController.createReklama
);
router.post(
  "/reklama/edit",
  reklamaController.uploadReklama,
  reklamaController.updateReklama
);
router.post("/reklama/delete", reklamaController.deleteReklama);

router.get("/edit-user/:id", viewsController.editSubscribers);

router.post(
  "/edit-user/:id",
  viewsController.uploadPhoto,
  viewsController.resizePhotoUser,
  viewsController.editSubscriber
);

router.post("/user/delete", userController.deleteUser);

module.exports = router;
