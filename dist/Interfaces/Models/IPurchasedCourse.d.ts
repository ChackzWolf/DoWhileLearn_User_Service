import mongoose from "mongoose";
export interface IPurchasedCourse {
    courseId: mongoose.Types.ObjectId;
    progress: number;
    currentLesson?: ICurrentLesson;
    completedLessons: ICompletedLesson[];
    completed: boolean;
    lastAccessed: Date;
}
export interface ICurrentLesson {
    module?: number;
    lesson?: number;
}
interface ICompletedLesson {
    module: number;
    lesson: number;
    noTest: boolean;
    testCompleted: boolean;
}
export {};
