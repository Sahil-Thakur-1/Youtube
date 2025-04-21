import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const userRoutes = express.Router();

// userRoutes.route('/register').post(upload.fields([
//     {
//         name: "avatar",
//         maxCount: 1
//     }
// ]), registerUser
// )

userRoutes.post('/register', upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), registerUser);
userRoutes.post('/login', loginUser);
//secure route
userRoutes.post('/logout', verifyJwt, logoutUser);


export default userRoutes;