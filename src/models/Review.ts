import { ReviewType } from "./ReviewType";

export interface Review {
    rating: number | null;
    comment?: string;
    type?: ReviewType;
    author?: string;
}