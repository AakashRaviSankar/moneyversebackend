import { User } from 'modules/users/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'finance', name: 'wallets' })
@Unique(['userId']) // Ensures one wallet per user
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' }) // Bi-directional relation
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true }) // Ensures uniqueness in the DB as well
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
