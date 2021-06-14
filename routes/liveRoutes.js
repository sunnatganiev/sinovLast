const express = require("express");
const liveController = require("../controllers/liveController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(liveController.getLives)
  .post(
    authController.restirctTo("admin"),
    liveController.uploadLive,
    liveController.createLive
  );

router
  .route("/:id")
  .get(liveController.getLive)
  .patch(
    authController.restirctTo("admin"),
    liveController.uploadLive,
    liveController.updateLive
  ).delete(authController.restirctTo('admin'), liveController.deleteLive)

module.exports = router;
