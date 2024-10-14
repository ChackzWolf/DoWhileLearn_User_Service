import mongoose from "mongoose";
import "dotenv/config";
import { configs } from "../ENV_configs/ENV.configs";

const connectDB = async () => {
  try {
    if (!configs.MONGODB_URL_USER) { 
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    await mongoose.connect(configs.MONGODB_URL_USER); 
    console.log("User Service Database connected");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}; 

export { connectDB };
