const express = require("express");
const multer = require("multer");
const { createMemory, getMemories } = require("../controllers/memoryController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getMemories);
router.post("/", protect, upload.single("image"), createMemory);

module.exports = router;
