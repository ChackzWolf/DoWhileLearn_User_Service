import mongoose from "mongoose";

export interface IPurchasedCourse {
    courseId: mongoose.Types.ObjectId; // Reference to Course
    progress: number;
    currentLesson?: ICurrentLesson;
    completedLessons: ICompletedLesson[];
    completed: boolean;
    lastAccessed: Date;
  }


interface ICurrentLesson {
    module?: number;
    lesson?: number;
  }
  
interface ICompletedLesson {
  module: number;
  lesson: number;
  noTest: boolean;
  testCompleted: boolean;
}