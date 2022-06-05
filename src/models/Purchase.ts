
import { Items } from './Items';
import { Tasks } from './Tasks';
export interface Purchase {
    id: number;
    title: string;
    date: string;
    description: string;
    img?: string;
    items: Items[];
    reviewed: boolean;
    peerReviewed: boolean;
    task: Tasks
}