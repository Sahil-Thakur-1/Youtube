import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandlers.js"
import { user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const generateAccessAndRefreshToken = async (User) => {
    try {
        const accessToken = await User.generateAccessToken();
        const refreshToken = await User.generateRefreshToken();

        console.log("Bearer", accessToken, refreshToken);

        User.refreshToken = refreshToken;
        await User.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    }
    catch (e) {
        throw new ApiError(500, `Error while generating refresh token and access token ${e}`);
    }

}

const registerUser = asyncHandler(async (req, res) => {
    //aquire the required parameters
    //validation
    //check if alreay exists : email
    //check for image and check for avatar : upload them on cloudinary
    //check for the image is updated or not
    //create user object - create entry on the database
    //remove password and refresh token from response
    //pass the message user is succesfully created with status code

    const { email, fullName, userName, password } = req.body;

    if ([email, fullName, userName, password].some((fields) => fields.trim() == "")) {
        throw new ApiError(400, "All Fields are required");
    }

    const existedUser = await user.findOne(
        {
            $or: [{ email }, { userName }]
        }
    );

    if (existedUser) {
        throw new ApiError(409, 'User with this email and password already exists')
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    const User = await user.create({
        userName: userName.toLowerCase(),
        email: email,
        fullName: fullName,
        avatar: avatar.url,
        password: password
    });


    const createdUser = await user.findById(User._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Someting went wrong while creating user");
    }

    return res.status(201).json(
        new ApiResponse(201, "User Registered succesfully", createdUser)
    );

});


const loginUser = asyncHandler(async (req, res) => {

    // acquire pamater to login
    // check if the user is registered or not
    // if registered then matach the credentials and login
    // create a refresh token and accestoken
    // send token in cookies

    const { email, password, userName } = req.body;

    if (!email && !password) {
        throw new ApiError(400, "user or email is required");
    }

    const User = await user.findOne({
        $or: [{ userName }, { email }]
    });

    if (!User) {
        throw new ApiError(404, "User with this credentials not exists");
    }

    const isPasswordValid = await User.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Password is not correct");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(User);

    const loggedUser = User.toObject();

    delete loggedUser.password;
    delete loggedUser.refreshToken;

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "User logged in succesfully", { user: loggedUser, accessToken: accessToken, refreshToken: refreshToken })
        );

});


const logoutUser = asyncHandler(async (req, res) => {
    const id = req.user._id;

    user.findByIdAndUpdate(id, {
        $set: {
            refreshToken: undefined
        }
    });

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.
        status(200).
        clearCookie("accessToken", options).
        clearCookie("refreshToken", options).
        json(new ApiResponse(200, "user logout succesfully"));


});


export { registerUser, loginUser, logoutUser };