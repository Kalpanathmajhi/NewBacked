import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const userSchema = new Schema({


    usename: {
        type: String,
        required: true,
        uniquie: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        uniquie: true,
        lowercase: true,
        trim: true,

    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatars: {
        type: String, //cloudnary  image url 
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: true,
        uniquie: [true, 'Password is required'],


    },
    refreshToken: {
        type: String,


    },

},
    { timestamps: true }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPaawordCorrect = async function
    (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {

    return jwt.sign({
        _id: this._id,
        email: this.email,
        usename: this.usename,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userSchema)


//