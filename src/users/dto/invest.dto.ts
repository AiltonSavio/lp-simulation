import User from '../user.entity';

export class InvestDto {
  user: User;
  poolAddress: string;
  poolPrice: number;
}

export default InvestDto;
