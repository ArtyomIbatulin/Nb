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

router.post("/register", userController.registration);
router.post("/login", userController.login);
router.get("/users", authMiddleware, userController.getAllUsers);
router.get("/users/:id", authMiddleware, userController.getUserById);
router.get("/current", authMiddleware, userController.currentUser);
router.put(
  "/users/:id",
  authMiddleware,
  uploads.single("avatar"),
  userController.updateUser,
);

// router.post("/books", bookController.createBook); // add check admin
// router.get("/books", bookController.findAllBooks);
// router.get("/books/:id", bookController.findBookById);
// router.delete("/books/:id", bookController.deleteBook); // add check admin
// router.put("/books/:id", bookController.putBookById); // add check admin

router.post("/posts", authMiddleware, postController.createPost);
router.get("/posts", authMiddleware, postController.getAllPosts);
router.get("/posts/:id", authMiddleware, postController.getPostById);
router.delete("/posts/:id", authMiddleware, postController.deletePost);

router.post("/comments", authMiddleware, commentController.createComment);
router.delete("/comments/:id", authMiddleware, commentController.deleteComment);

router.post("/likes", authMiddleware, likeController.likePost);
router.delete("/likes/:id", authMiddleware, likeController.unlikePost);

router.post("/follow", authMiddleware, followController.followUser);
router.delete("/unfollow/:id", authMiddleware, followController.unfollowUser);

module.exports = router;
