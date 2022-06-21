
import { Item } from './Item';
import { Task } from './Task';
export interface Purchase {
    id: number;
    title: string;
    date: string;
    description: string;
    img?: string;
    items: Item[];
    reviewed: boolean;
    peerReviewed: boolean;
    task: Task
    owner: string;
}