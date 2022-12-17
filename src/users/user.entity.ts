import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: false })
  public balance: number;

  @Column({ nullable: true })
  public poolAddress: string;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  public poolShares: number;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
}

export default User;
