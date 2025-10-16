import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary"; // your cloudinary config file

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return {
      folder: "dresses",
      public_id: `${file.fieldname}-${unique}`,
      format: path.extname(file.originalname).replace(".", ""), // extract extension (without dot)
    };
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Only image files are allowed (.jpg, .jpeg, .png, .webp)!"));
};

export const uploadDressImages = multer({ storage, fileFilter });
