import { User } from '../../users/entities/user.entity';
import { Rating } from '../../ratings/entities/rating.entity';
export declare class Store {
    id: number;
    name: string;
    address: string;
    ownerId: number;
    owner: User;
    ratings: Rating[];
}
