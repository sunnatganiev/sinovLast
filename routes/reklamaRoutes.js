const express = require("express");
const reklamaController = require("../controllers/reklamaController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(reklamaController.getReklamas);
// .post(
//   authController.protect,
//   authController.restirctTo("admin"),
//   reklamaController.uploadReklama,
//   reklamaController.createReklama
// );

router.route("/:id").get(reklamaController.getReklama);
// .patch(
//   authController.protect,
//   authController.restirctTo("admin"),
//   reklamaController.uploadReklama,
//   reklamaController.updateReklama
// )
// .delete(authController.restirctTo("admin"), reklamaController.deleteReklama);

module.exports = router;
