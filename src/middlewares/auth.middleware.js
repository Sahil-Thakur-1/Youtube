import { asyncHandler } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { user } from "../models/user.model.js"

const verifyJwt = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.accessToken || res.header("Authorization").replace("Bearer", "");

    if (!accessToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);

    const User = await user.findById(decodedToken.id).select("-password -refreshToken");

    if (!User) {
        throw new ApiError(401, "Invalid AccessToken");
    }

    req.user = User;

    next();


});


export { verifyJwt }