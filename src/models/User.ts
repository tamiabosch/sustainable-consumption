import { FieldValue, Timestamp } from "firebase/firestore";
import { ReviewType } from "./ReviewType";
import { Task } from "./Task";
export interface User {
    id: number;
    alias: string;  
    email: string;
    completed: boolean;
    lastLogin: number;
    reviewType: ReviewType;
    reviewsWritten: number;
    peerReviewsWritten: number;
    startDate: Timestamp;
    week: Task[];

}