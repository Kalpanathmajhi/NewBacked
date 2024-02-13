import dotenv from 'dotenv'

import connectDB from "./db/index.js";
//very important line
dotenv.config({
    path: './env'
})

connectDB()






















// import { Express } from "express";
// const app = express()
// ( async () => {
//     try{
//    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//    app.on("error", () => {
//     console.log("Error: ",error);
//     throw error 
//    })
//    app.listen(process.env.PORT, ()=> {
//     console.log(`App is listining on port ${process.env.PORT} `)})
//     } catch (error){
//         console.error("ERROR ", error)
//         throw err
//     }
// })()
