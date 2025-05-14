import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<Store[]> {
    try {
      const stores = await this.storeRepository.find({ relations: ['owner'] });
      return stores || [];
    } catch (error) {
      console.error('Error fetching all stores:', error.message);
      return [];
    }
  }

  async findByOwner(ownerId: number): Promise<Store[]> {
    try {
      const stores = await this.storeRepository.find({ where: { ownerId }, relations: ['owner'] });
      return stores || [];
    } catch (error) {
      console.error('Error fetching stores for owner:', error.message);
      return [];
    }
  }

  async findOneById(id: number): Promise<Store> {
    try {
      return await this.storeRepository.findOne({ where: { id }, relations: ['owner'] });
    } catch (error) {
      console.error('Error fetching store by ID:', error.message);
      return null;
    }
  }

  async create(createStoreDto: CreateStoreDto, ownerId: number): Promise<Store> {
    const store = this.storeRepository.create({
      ...createStoreDto,
      ownerId,
    });
    const savedStore = await this.storeRepository.save(store);
    return Array.isArray(savedStore) ? savedStore[0] : savedStore;
  }

  async remove(id: number, user: any): Promise<void> {
    const store = await this.storeRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!store) {
      throw new ForbiddenException('Store not found');
    }
    if (user.role !== 'ADMIN' && store.ownerId !== user.sub) {
      throw new ForbiddenException('You can only delete your own stores');
    }
    await this.storeRepository.delete(id);
  }
}