import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoresService {
    private storeRepository;
    constructor(storeRepository: Repository<Store>);
    findAll(): Promise<Store[]>;
    findByOwner(ownerId: number): Promise<Store[]>;
    findOneById(id: number): Promise<Store>;
    create(createStoreDto: CreateStoreDto, ownerId: number): Promise<Store>;
    remove(id: number, user: any): Promise<void>;
}
