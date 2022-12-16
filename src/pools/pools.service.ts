import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class PoolsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getPools() {
    const API_URL =
      'https://stats.apy.vision/api/v1/pool_search/advanced_search';
    const params = {
      avg_period_daily_volume_usd: 250000,
      avg_period_reserve_usd: 1000000,
      min_pool_age_days: 7,
      vr: 0,
      exchanges: 'uniswap_eth',
      access_token: this.configService.get('API_ACCESS_TOKEN'),
    };
    const request = this.httpService
      .get(API_URL, { params })
      .pipe(map((res) => res.data?.results))
      .pipe(
        catchError(() => {
          throw new HttpException('API not available', HttpStatus.FORBIDDEN);
        }),
      );

    const results = await lastValueFrom(request);
    const pools = results.map((pool: any) => {
      const container = {} as any;

      container.name = pool.name;
      container.price = pool.avg_lp_price;

      return container;
    });

    return pools;
  }

  async getPool(token1Symbol: string, token2Symbol: string) {
    const API_URL =
      'https://stats.apy.vision/api/v1/pool_search/advanced_search';
    const params = {
      avg_period_daily_volume_usd: 250000,
      avg_period_reserve_usd: 1000000,
      min_pool_age_days: 7,
      vr: 0,
      exchanges: 'uniswap_eth',
      access_token: this.configService.get('API_ACCESS_TOKEN'),
    };
    const request = this.httpService
      .get(API_URL, { params })
      .pipe(map((res) => res.data?.results))
      .pipe(
        catchError(() => {
          throw new HttpException('API not available', HttpStatus.FORBIDDEN);
        }),
      );

    const results = await lastValueFrom(request);

    const pool = results.find(
      ({ name }) => name === `${token1Symbol}/${token2Symbol}`,
    );
    if (pool) {
      return {
        name: pool.name,
        price: pool.avg_lp_price,
      };
    }

    throw new HttpException('Pool not found', HttpStatus.NOT_FOUND);
  }
}
