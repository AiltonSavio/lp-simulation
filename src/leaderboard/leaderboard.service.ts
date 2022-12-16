import { Injectable } from '@nestjs/common';
import { PoolsService } from '../pools/pools.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly poolsService: PoolsService,
  ) {}

  async getPortfolio(email: string): Promise<number> {
    const user = await this.usersService.getByEmail(email);
    const pool = await this.poolsService.getPool(user.poolAddress);
    return user.poolShares * pool.price;
  }
}
