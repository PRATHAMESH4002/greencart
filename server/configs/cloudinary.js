import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    secure: true
  });
};

export default connectCloudinary;
