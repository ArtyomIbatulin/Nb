const express = require("express");
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const likeController = require("../controllers/likeController");
const followController = require("../controllers/followController");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

const uploadDestination = "uploads";

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, next) {
    next(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

router.post("/api/v1/register", userController.registration);
router.post("/api/v1/login", userController.login);
router.get("/api/v1/users:id", authMiddleware, userController.getUserById);
router.get("/api/v1/current", authMiddleware, userController.currentUser);
router.put("/api/v1/users:id", authMiddleware, userController.updateUser);

router.post("/api/v1/books", bookController.createBook); // add check admin
router.get("/api/v1/books", bookController.findAllBooks);
router.get("/api/v1/books/:id", bookController.findBookById);
router.delete("/api/v1/books/:id", bookController.deleteBook); // add check admin
router.put("/api/v1/books/:id", bookController.putBookById); // add check admin

router.post("/api/v1/posts", authMiddleware, postController.createPost);
router.get("/api/v1/posts", authMiddleware, postController.getAllPosts);
router.get("/api/v1/posts/:id", authMiddleware, postController.getPostById);
router.delete("/api/v1/posts/:id", authMiddleware, postController.deletePost);

router.post(
  "/api/v1/comments",
  authMiddleware,
  commentController.createComment
);
router.delete(
  "/api/v1/comments/:id",
  authMiddleware,
  commentController.deleteComment
);

router.post("/api/v1/likes", authMiddleware, likeController.likePost);
router.delete("/api/v1/likes/:id", authMiddleware, likeController.unlikePost);

router.post("/api/v1/follow", authMiddleware, followController.followUser);
router.delete(
  "/api/v1/unfollow/:id",
  authMiddleware,
  followController.unfollowUser
);

module.exports = router;
