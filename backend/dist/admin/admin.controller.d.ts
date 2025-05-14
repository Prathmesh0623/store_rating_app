import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(req: any): Promise<{
        userId: number;
        userCount: number;
        storeCount: number;
        ratingCount: number;
    }>;
}
