import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PoolsService } from '../pools/pools.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly poolsService: PoolsService,
  ) {}

  @Post('invest')
  async invest(@Body() poolAddress: string, @Body() userId: number) {
    const pool = await this.poolsService.getPool(poolAddress);
    const user = await this.usersService.getById(userId);

    return this.usersService.invest({
      user,
      poolAddress: pool.address,
      poolPrice: pool.price,
    });
  }
}
