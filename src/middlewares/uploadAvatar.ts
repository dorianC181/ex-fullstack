import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = (req.body.name || "user").replace(/[^a-zA-Z0-9_-]/g, "_");
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${safeName}${ext}`);
  }
});

export const uploadAvatar = multer({ storage });