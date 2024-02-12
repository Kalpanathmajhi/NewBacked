import mongoose from "mongoose";
import { DB_NAME } from "../constants";


const connectDB = async () => {
    try {
        const  connectionInstance = await mongoose.connect
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit(1);
    }

}