import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (localFilePath != null) {
            const response = await cloudinary.uploader.upload(localFilePath, {

            });
            fs.unlinkSync(localFilePath);
            // console.log("data uploaded on cloudinary", response);
            return response;
        }
    }
    catch (e) {
        console.log(e);
        fs.unlinkSync(localFilePath);
    }
}

export { uploadOnCloudinary }