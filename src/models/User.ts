import { ReviewType } from "./ReviewType";
import { Purchase } from "./Purchase";
export interface User {
    id: number;
    alias: string;  
    name: string;
    completed: false;
    lastLogin: Date;
    loginCount: number;
    label: ReviewType;
    purchases: Purchase[];
}