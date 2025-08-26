const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploadDestination = "uploads";

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, next) {
    next(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

router.get("/register", function (req, res, next) {
  res.send("register OK");
});

module.exports = router;
