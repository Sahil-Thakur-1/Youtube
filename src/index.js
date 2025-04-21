import { dbConnect } from "./db/index.js";
import dotenv from "dotenv";
import app from './app.js'

dotenv.config({
    path: "./.env"
});

dbConnect().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`sever is running on the port : ${process.env.PORT || 8000}`);
    })
}).catch((e) => {
});


