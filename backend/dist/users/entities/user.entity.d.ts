import { Store } from '../../stores/entities/store.entity';
import { Rating } from '../../ratings/entities/rating.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    address: string;
    password: string;
    role: string;
    stores: Store[];
    ratings: Rating[];
}
