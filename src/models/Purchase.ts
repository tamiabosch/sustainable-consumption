
import { Item } from './Item';
import { Task } from './Task';
export interface Purchase {
    id: string;
    title: string;
    date: string;
    task: Task
    description?: string;
    img?: string;
    items?: Item[];
    reviewed?: boolean;
    peerReviewed?: boolean;
    overview?: boolean
    owner: string;
    link?: string;
}

