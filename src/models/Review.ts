import { Item } from "./Item";
import { Purchase } from "./Purchase";
import { ReviewType } from "./ReviewType";
import { Task } from "./Task";

export interface Review {
    review: ReviewItem []
    items: Item []
    purchase: Purchase["id"]
    reviewType?: ReviewType;
    author?: string;
    task?: Task;
}

export interface ReviewItem {
    rating: number | null;
    comment?: string;
}