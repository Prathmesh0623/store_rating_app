import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { StoresService } from '../stores/stores.service';
export declare class RatingsService {
    private ratingRepository;
    private storesService;
    constructor(ratingRepository: Repository<Rating>, storesService: StoresService);
    findByUser(userId: number): Promise<Rating[]>;
    create(userId: number, ratingDto: any): Promise<Rating>;
    update(userId: number, id: number, ratingDto: any): Promise<Rating>;
}
