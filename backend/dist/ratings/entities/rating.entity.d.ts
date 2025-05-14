import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class Rating {
    id: number;
    rating: number;
    review: string;
    userId: number;
    storeId: number;
    user: User;
    store: Store;
}
