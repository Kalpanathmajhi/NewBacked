import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
//generate acess & refresh tokens
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()


    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token")

  }
}


//register
const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  // check if user already exists:userName, email
  //check for images and check for avatar
  //upload in cloudnary
  //create user object - crrate entry in db
  //remove password and response token fiels from response
  //return res 
  const { fullName, email, username, password } = req.body
  console.log("email", email);
  if (
    [fullName, email, username, password].some((field) =>
      field?.trim() === "")

  ) {
    throw new ApiError(400, "All fields are required")
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }]

  })
  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }
  const avatarLocalpath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;

  }

  if (!avatarLocalpath) {
    throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong when creating the account");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )
})
//login user
const loginUser = asyncHandler(async (req, res) => {
  //req body -username , passsword / query param-
  // username or email
  //fine the user
  //password check
  //acess and refresh token
  //send cookies

  const { email, username, password } = req.body
console.log(email,"\n",username);
console.log("Request Body:", req.body);
  if (!username && !email) {
    throw new ApiError(400, "username or email is required")
}

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (!user) {
    throw new ApiError(404, "User does not exist")
  }
  const isPasswordValid = await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credintials")
  }
  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
  
  const loggedInUser =  await User.findById(user._id)
  .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure:true
  }
  return res.status(200)
  .cookie("acessToken",accessToken,options )
  .cookie("refreshToken", refreshToken,options)
  .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken,refreshToken
        },
        "User  Logged In SucessFully"
      )
  )
 
})

const logoutUser = asyncHandler(async (req,res)=>{
 await User.findByIdAndUpdate(
    req.user.id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new:true
    }
  )
  const options ={
    httpOnly :true,
    secure:true
  }
  return  res.status(200)
  .clearCookie('accessToken',options)
  .clearCookie('refreshToken', options)
  .json(new ApiResponse(200, {}, "User logged out"))
  

})


export {
  registerUser,
  loginUser,
  logoutUser
}