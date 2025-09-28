const express = require("express");
const userController = require("../controllers/userController");
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
router.get("/api/v1/user:id", authMiddleware, userController.getUserById);
router.get("/api/v1/current", authMiddleware, userController.currentUser);
router.put("/api/v1/user:id", authMiddleware, userController.updateUser);

module.exports = router;
