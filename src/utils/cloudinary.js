import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs"
      
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLODINARY_API_KEY,
  api_secret:process.env.CLODINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
       if (!localFilePath) return null
     //upload the file on coludiry
    const response= await cloudinary.uploader.uploader(localFilePath,{
        resource_type: "auto"
     })
     console.log("file is uploaded in cloudinry", response.url);
     return response;
   } catch (error) {
    fs.unlinkSync(localFilePath)
      return null;
    } 
       
}

export default uploadOnCloudinary


