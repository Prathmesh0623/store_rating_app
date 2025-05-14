import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
  ) {}

  async getOwnerDashboard(userId: number) {
    const stores = await this.storeRepository.find({ where: { owner: { id: userId } } });
    const ratings = await this.ratingRepository.find({
      where: { store: { owner: { id: userId } } },
    });
    return { userId, stores, ratings };
  }
}