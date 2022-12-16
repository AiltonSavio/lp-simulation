import { Controller, Get, Param } from '@nestjs/common';
import { PoolsService } from './pools.service';

@Controller('pools')
export class PoolsController {
  constructor(private readonly poolService: PoolsService) {}

  @Get()
  async getPools() {
    return this.poolService.getPools();
  }

  @Get('/:pool_address')
  async getPool(@Param('pool_address') poolAddress: string) {
    return this.poolService.getPool(poolAddress);
  }
}
