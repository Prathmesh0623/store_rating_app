import { Controller, Get, Post, Body, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    try {
      if (req.user.role === 'STORE_OWNER') {
        return await this.storesService.findByOwner(req.user.sub);
      }
      return await this.storesService.findAll();
    } catch (error) {
      console.error('Error in findAll stores:', error.message);
      return [];
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('STORE_OWNER', 'ADMIN')
  @Post()
  create(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    return this.storesService.create(createStoreDto, req.user.role === 'STORE_OWNER' ? req.user.sub : createStoreDto.ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STORE_OWNER')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.storesService.remove(+id, req.user);
  }
}