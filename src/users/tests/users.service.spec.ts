import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let findOneBy: jest.Mock;
  let save: jest.Mock;
  beforeEach(async () => {
    findOneBy = jest.fn();
    save = jest.fn().mockReturnValue(Promise.resolve());
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy,
            save,
          },
        },
      ],
    }).compile();
    service = await module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when getting a user by email', () => {
    describe('and the user is matched', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOneBy.mockReturnValue(Promise.resolve(user));
      });
      it('should return the user', async () => {
        const fetchedUser = await service.getByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      });
    });
    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOneBy.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(service.getByEmail('test@test.com')).rejects.toThrow(
          'User with this email does not exist',
        );
      });
    });
  });

  describe('when getting a user by id', () => {
    describe('and the user is matched', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOneBy.mockReturnValue(Promise.resolve(user));
      });
      it('should return the user', async () => {
        const fetchedUser = await service.getById(1);
        expect(fetchedUser).toEqual(user);
      });
    });
    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOneBy.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(service.getById(1)).rejects.toThrow(
          'User with this id does not exist',
        );
      });
    });
  });

  describe('when user invests in a pool', () => {
    describe('and the user is already invested in a pool', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        user.poolAddress = '0x811beed0119b4afce20d2583eb608c6f7af1954f';
      });
      it('should throw an error', async () => {
        await expect(
          service.invest({
            user,
            poolAddress: '0x811beed0119b4afce20d2583eb608c6f7af1954f',
            poolPrice: 2.3000582494833397,
          }),
        ).rejects.toThrow('User already invested in a pool');
      });
    });
    describe('and the user is not already invested in a pool', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
      });
      it('should return the user', async () => {
        const newUser = await service.invest({
          user,
          poolAddress: '0x811beed0119b4afce20d2583eb608c6f7af1954f',
          poolPrice: 2.3000582494833397,
        });
        expect(newUser).toEqual(user);
      });
    });
  });
});
