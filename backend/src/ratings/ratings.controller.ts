import { Controller, Get, Post, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.ratingsService.findByUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() ratingDto: any, @Request() req) {
    return this.ratingsService.create(req.user.sub, ratingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() ratingDto: any, @Request() req) {
    return this.ratingsService.update(req.user.sub, +id, ratingDto);
  }
}