import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError} from "../utils/ApiError.js"
import {User} from  '../models/user.model.js'
const registerUser = asyncHandler (async (req,res)=> {
 //get user details from frontend
 //validation - not empty
 // check if user already exists:userName, email
 //check for images and check for avatar
 //upload in cloudnary
  //create user object - crrate entry in db
  //remove password and response token fiels from response
  //return res 
 const {fullName, email, username, password} = req.body
 console.log("email",email);
if (
  [fullName, email, username, password].some((field)=> 
  field?.trim() === "")

){
throw new ApiError(400, "All fields are required")
}
const existedUser=User.findOne( {$or:[{username},{email}]})
})
if (existedUser) {
  throw new ApiError(409,"User already exist");
}

export {registerUser}