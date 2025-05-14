import { Repository } from 'typeorm';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
export declare class OwnerService {
    private storeRepository;
    private ratingRepository;
    constructor(storeRepository: Repository<Store>, ratingRepository: Repository<Rating>);
    getOwnerDashboard(userId: number): Promise<{
        userId: number;
        stores: Store[];
        ratings: Rating[];
    }>;
}
