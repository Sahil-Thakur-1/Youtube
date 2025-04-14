import { dbConnect } from "./db/index.js";
import dotemv from "dotenv";
import app from './app.js'

dotemv.config({
    path: "./.env"
});

dbConnect().then(()=>{
app.listen(process.env.PORT || 8000,()=>{
    console.log(`sever is running on the port : ${process.env.PORT || 8000}`);
})
}).catch((e)=>{

});


