import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { PoolsService } from '../pools.service';

describe('PoolsService', () => {
  let service: PoolsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoolsService, ConfigService],
      imports: [HttpModule],
    }).compile();

    service = module.get(PoolsService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });
  describe('when API is available', () => {
    beforeEach(() => {
      const result: any = {
        data: {
          results: [
            {
              name: 'SHIB/WETH',
              avg_lp_price: 2.3000582494833397,
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
    });

    it('should return pools', async () => {
      const pools = await service.getPools();
      expect(pools).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            price: expect.any(Number),
          }),
        ]),
      );
    });

    describe('and the pool exists', () => {
      it('should return a pool', async () => {
        const pool = await service.getPool('SHIB', 'WETH');
        expect(pool).toEqual(
          expect.objectContaining({
            name: expect.any(String),
            price: expect.any(Number),
          }),
        );
      });
    });

    describe('and the pool does not exist', () => {
      it('should throw an error', async () => {
        await expect(service.getPool('SHIB', 'ETH')).rejects.toThrow(
          'Pool not found',
        );
      });
    });
  });
});
