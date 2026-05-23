const fs = require("fs");
const path = require("path");
const Memory = require("../models/Memory");
const { shouldUseS3, uploadBufferToS3 } = require("../config/s3");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const sanitizeFileName = (name) => name.replace(/[^a-zA-Z0-9._-]/g, "_");

const createMemory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { caption, location, activity } = req.body;
    const fileKey = `memories/${Date.now()}-${sanitizeFileName(
      req.file.originalname
    )}`;

    let imageUrl = "";

    if (shouldUseS3()) {
      imageUrl = await uploadBufferToS3({
        key: fileKey,
        contentType: req.file.mimetype,
        body: req.file.buffer,
      });
    } else {
      const localFileName = `${Date.now()}-${sanitizeFileName(
        req.file.originalname
      )}`;
      const localPath = path.join(uploadDir, localFileName);
      fs.writeFileSync(localPath, req.file.buffer);
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${localFileName}`;
    }

    const memory = await Memory.create({
      imageUrl,
      caption,
      location,
      activity,
      uploadedBy: req.user._id,
    });

    return res.status(201).json(memory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMemories = async (_req, res) => {
  try {
    const memories = await Memory.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json(memories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMemory,
  getMemories,
};
