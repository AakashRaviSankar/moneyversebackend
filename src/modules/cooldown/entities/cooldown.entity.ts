import { User } from 'modules/users/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Cooldown {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.cooldowns, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @Column()
  task: string;

  @Column('simple-json', { nullable: false }) // Stores an array of numbers properly
  numbers: number[];

  @Column({ type: 'bigint', nullable: true, default: null }) // Expiry timestamp (null means no cooldown)
  expireAt: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
