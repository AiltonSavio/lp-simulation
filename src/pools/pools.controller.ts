import { Controller, Get, Param } from '@nestjs/common';
import { PoolsService } from './pools.service';

@Controller('pools')
export class PoolsController {
  constructor(private readonly poolService: PoolsService) {}

  @Get()
  async getPools() {
    return this.poolService.getPools();
  }

  @Get('/:token1_symbol/:token2_symbol')
  async getPool(
    @Param('token1_symbol') token1Symbol: string,
    @Param('token2_symbol') token2Symbol: string,
  ) {
    return this.poolService.getPool(token1Symbol, token2Symbol);
  }
}
