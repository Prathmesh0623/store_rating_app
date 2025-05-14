import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
export declare class AdminService {
    private userRepository;
    private storeRepository;
    private ratingRepository;
    constructor(userRepository: Repository<User>, storeRepository: Repository<Store>, ratingRepository: Repository<Rating>);
    getAdminDashboard(userId: number): Promise<{
        userId: number;
        userCount: number;
        storeCount: number;
        ratingCount: number;
    }>;
}
