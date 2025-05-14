import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    findAll(req: any): Promise<import("./entities/store.entity").Store[]>;
    create(createStoreDto: CreateStoreDto, req: any): Promise<import("./entities/store.entity").Store>;
    remove(id: string, req: any): Promise<void>;
}
