import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import InvestDto from './dto/invest.dto';
import User from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async invest({ user, poolAddress, poolPrice }: InvestDto) {
    if (user.poolAddress) {
      throw new HttpException(
        'User already invested in a pool',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.poolAddress = poolAddress;
    user.poolShares = user.balance / poolPrice;
    user.balance = 0;
    await this.usersRepository.save(user);
    return user;
  }
}
