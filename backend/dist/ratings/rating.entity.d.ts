import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
export declare class Rating {
    id: number;
    value: number;
    user: User;
    store: Store;
    createdAt: Date;
    updatedAt: Date;
}
