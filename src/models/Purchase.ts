
import { Items } from './Items';
export interface Purchase {
    id: number;
    title: string;
    description: string;
    img: string;
    items: Items[];
}