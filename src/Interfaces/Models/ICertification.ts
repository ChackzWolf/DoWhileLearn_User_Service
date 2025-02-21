import mongoose from "mongoose";

export interface ICertification {
    courseId: mongoose.Types.ObjectId; // Reference to Course
    title: string;
    issueDate: Date;
    certificateUrl: string;
  }