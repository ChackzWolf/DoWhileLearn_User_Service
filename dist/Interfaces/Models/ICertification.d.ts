import mongoose from "mongoose";
export interface ICertification {
    courseId: mongoose.Types.ObjectId;
    title: string;
    issueDate: Date;
    certificateUrl: string;
}
