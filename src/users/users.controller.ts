import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PoolsService } from '../pools/pools.service';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly poolsService: PoolsService,
  ) {}

  @Post('invest')
  @UseGuards(JwtAuthenticationGuard)
  async invest(@Body() poolAddress: string, @Req() req: RequestWithUser) {
    const pool = await this.poolsService.getPool(poolAddress);

    return this.usersService.invest({
      user: req.user,
      poolAddress: pool.address,
      poolPrice: pool.price,
    });
  }
}
