import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    private storesService: StoresService,
  ) {}

  async findByUser(userId: number): Promise<Rating[]> {
    try {
      return await this.ratingRepository.find({ where: { userId }, relations: ['store'] });
    } catch (error) {
      console.error('Error fetching ratings by user:', error.message);
      return [];
    }
  }

  async create(userId: number, ratingDto: any): Promise<Rating> {
    const store = await this.storesService.findOneById(ratingDto.storeId);
    if (!store) {
      throw new BadRequestException('Store not found');
    }
    const rating = this.ratingRepository.create({
      ...ratingDto,
      userId,
    });
    const savedRating = await this.ratingRepository.save(rating);
    return Array.isArray(savedRating) ? savedRating[0] : savedRating;
  }

  async update(userId: number, id: number, ratingDto: any): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({ where: { id, userId } });
    if (!rating) {
      throw new BadRequestException('Rating not found or you do not have permission to update it');
    }
    Object.assign(rating, ratingDto);
    const updatedRating = await this.ratingRepository.save(rating);
    return Array.isArray(updatedRating) ? updatedRating[0] : updatedRating;
  }
}