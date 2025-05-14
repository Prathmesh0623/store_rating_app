import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/rating.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
    stores: Store[];
    ratings: Rating[];
    createdAt: Date;
    updatedAt: Date;
}
