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




// async function migratePurchasedCourses() {
//   try {

//       // Find all users who have the old format
//       const users = await UserModel.find({ 'purchasedCourses.0': { $type: 'objectId' } });

//       for (const user of users) {
//           console.log(`Migrating user: ${user._id}`);

//           const updatedPurchasedCourses = user.purchasedCourses
//           .filter(course => {
//               // Make sure courseId is a valid string and 24 chars long
//               const courseId = course.courseId as unknown as string;
//               if (typeof courseId === 'string' && courseId.length === 24) {
//                   return true;
//               } else {
//                   console.warn(`Skipping invalid courseId: ${courseId}`);
//                   return false;
//               }
//           })
//           .map(course => ({
//               courseId: new ObjectId(course.courseId as unknown as string), // ✅ Now TypeScript knows it's a string
//               progress: course.progress || 0,
//               currentLesson: course.currentLesson || { module: 0, lesson: 0 },
//               completedLessons: course.completedLessons || [],
//               completed: course.completed || false,
//               lastAccessed: course.lastAccessed || new Date()
//           }));
//           user.purchasedCourses = updatedPurchasedCourses;
//           await user.save();

//           console.log(`User ${user._id} migrated successfully.`);
//       }

//       console.log('Migration completed!');
//       mongoose.disconnect();

//   } catch (error) {
//       console.error('Error during migration:', error);
//   }
// }

export { connectDB };