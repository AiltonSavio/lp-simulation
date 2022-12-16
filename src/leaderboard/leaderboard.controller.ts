import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get(':email')
  async getPortfolio(@Param('email') email: string): Promise<number> {
    return this.leaderboardService.getPortfolio(email);
  }
}
