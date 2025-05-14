import { RatingsService } from './ratings.service';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    findAll(req: any): Promise<import("./entities/rating.entity").Rating[]>;
    create(ratingDto: any, req: any): Promise<import("./entities/rating.entity").Rating>;
    update(id: string, ratingDto: any, req: any): Promise<import("./entities/rating.entity").Rating>;
}
