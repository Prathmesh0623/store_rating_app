import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STORE_OWNER')
  @Get('dashboard')
  async getDashboard(@Request() req) {
    return await this.ownerService.getOwnerDashboard(req.user.id);
  }
}