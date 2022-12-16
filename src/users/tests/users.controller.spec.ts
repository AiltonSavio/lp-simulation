import { HttpModule } from '@nestjs/axios';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { PoolsService } from '../../pools/pools.service';
import User from '../user.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let findOneBy: jest.Mock;
  let save: jest.Mock;
  let getPool: jest.Mock;
  let app: INestApplication;

  beforeEach(async () => {
    findOneBy = jest.fn();
    save = jest.fn().mockReturnValue(Promise.resolve());
    getPool = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy,
            save,
          },
        },
        {
          provide: PoolsService,
          useValue: {
            getPool,
          },
        },
        ConfigService,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /users/invest', () => {
    describe('when the user is matched', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOneBy.mockReturnValue(Promise.resolve(user));
        getPool.mockReturnValue({
          name: 'SHIB/WETH',
          price: 2.3000582494833397,
          address: '0x811beed0119b4afce20d2583eb608c6f7af1954f',
        });
      });
      it('should return the user', async () => {
        return request(app.getHttpServer())
          .post('/users/invest')
          .send({
            poolAddress: '0x811beed0119b4afce20d2583eb608c6f7af1954f',
            userId: 1,
          })
          .expect(201)
          .expect({
            poolAddress: '0x811beed0119b4afce20d2583eb608c6f7af1954f',
            poolShares: null,
            balance: 0,
          });
      });
    });
  });
});
