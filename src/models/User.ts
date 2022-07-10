import { ReviewType } from "./ReviewType";
import { Task } from "./Task";
export interface User {
    id: number;
    alias: string;  
    email: string;
    name?: string;
    completed: boolean;
    loginCount: number;
    reviewType: ReviewType;
    reviewsWritten: number;
    peerReviewsWritten: number;
    week: Task[];

}