import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
  ) {}

  async getAdminDashboard(userId: number) {
    const userCount = await this.userRepository.count();
    const storeCount = await this.storeRepository.count();
    const ratingCount = await this.ratingRepository.count();
    return { userId, userCount, storeCount, ratingCount };
  }
}