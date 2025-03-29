import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../RBAC/role/entities/role.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Cooldown } from 'modules/cooldown/entities/cooldown.entity';

@Entity({ schema: 'auth', name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  salt: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  isUpdated: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'int' })
  roleId: number;

  // One user has one wallet
  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet: Wallet;

  @Column({ type: 'int', unique: true, nullable: true }) // Prevents duplicate wallet IDs
  walletId: number | null;

  // One user has many transactions
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Cooldown, (cooldown) => cooldown.user)
  cooldowns: Cooldown[];
}
