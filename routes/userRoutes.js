const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get(
  "/",
  authController.protect,
  authController.restirctTo("admin"),
  userController.getUsers
);

router.use(authController.protect);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser
  )
  .delete(authController.restirctTo("admin"), userController.deleteUser);

module.exports = router;
