const express = require("express");
const newsController = require("../controllers/newsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(newsController.getAllNews)
  .post(
    authController.restirctTo("admin"),
    newsController.uploadNews,
    newsController.createNews
  );

router
  .route("/:id")
  .get(newsController.getNews)
  .patch(
    authController.restirctTo("admin"),
    newsController.uploadNews,
    newsController.updateNews
  )
  .delete(authController.restirctTo("admin"), newsController.deleteNews);

module.exports = router;
