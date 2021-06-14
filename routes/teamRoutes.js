const express = require("express");
const teamController = require("../controllers/teamController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(teamController.getAllTeam)
  .post(
    authController.restirctTo("admin"),
    teamController.uploadTeam,
    teamController.createTeam
  );

router
  .route("/:id")
  .get(teamController.getTeam)
  .patch(
    authController.restirctTo("admin"),
    teamController.uploadTeam,
    teamController.updateTeam
  ).delete(authController.restirctTo('admin'), teamController.deleteTeam)

module.exports = router;
