import { Timestamp } from "firebase/firestore";
import { ReviewType } from "./ReviewType";
import { Task } from "./Task";
export interface User {
    id: number;
    alias: string;  
    email: string;
    completed: boolean;
    lastLogin: number;
    reviewType: ReviewType;
    peerReviewsWritten: number;
    startDate: Timestamp;
    currentWeek: 0 | 1 | 2 ;
    task: Week;
    week: Task[];

}

export interface Week {
    week1: Task;
    week2: Task;
    week3: Task;
}