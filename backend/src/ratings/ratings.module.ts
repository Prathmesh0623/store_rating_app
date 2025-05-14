import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './entities/rating.entity';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating]),
    StoresModule, // Import StoresModule to provide StoresService
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}