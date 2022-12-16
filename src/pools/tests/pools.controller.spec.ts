import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { PoolsController } from '../pools.controller';
import { PoolsService } from '../pools.service';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('PoolsController', () => {
  let controller: PoolsController;
  let httpService: HttpService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoolsController],
      providers: [PoolsService, ConfigService],
      imports: [HttpModule],
    }).compile();

    controller = module.get<PoolsController>(PoolsController);
    httpService = module.get(HttpService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('GET pools', () => {
    it('should return an array of pools', async () => {
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

      return request(app.getHttpServer())
        .get('/pools')
        .expect(200)
        .expect([{ name: 'SHIB/WETH', price: 2.3000582494833397 }]);
    });
  });

  describe('GET pools/:poolName', () => {
    it('should return a pool', async () => {
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

      return request(app.getHttpServer())
        .get(`/pools/SHIB/WETH`)
        .expect(200)
        .expect({ name: 'SHIB/WETH', price: 2.3000582494833397 });
    });
  });
});
