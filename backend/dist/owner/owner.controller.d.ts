import { OwnerService } from './owner.service';
export declare class OwnerController {
    private readonly ownerService;
    constructor(ownerService: OwnerService);
    getDashboard(req: any): Promise<{
        userId: number;
        stores: import("../stores/entities/store.entity").Store[];
        ratings: import("../ratings/entities/rating.entity").Rating[];
    }>;
}
