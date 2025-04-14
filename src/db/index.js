import mongoose from 'mongoose';

export const dbConnect  = async () => {
 try {
  const dbInstance = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDb connection succesful\nMongoose host: ${dbInstance.connection.host}`);
 }
 catch(e){
  console.log(`mongoose connection error : ${e}`);
  process.exit(1);
 }
}
