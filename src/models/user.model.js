import mongoose, { Schema, Types } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    fullName: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        // required: true,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});


userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    next();
});


userSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(password, this.password);
};


userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        id: this._id,
        userName: this.userName,
        email: this.email,
        password: this.password,
    }, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        id: this._id,
    }, process.env.REFRESH_TOKEN_KEY, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};


export const user = mongoose.model("User", userSchema);