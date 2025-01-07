import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(
    filePath,
    {
      folder: "documents",
      resource_type: "raw",
      format: "pdf",
    },
    (error, result) => {
      if (error) {
        console.error(error);
      }
      console.log(result);
      return result;
    }
  );
};
