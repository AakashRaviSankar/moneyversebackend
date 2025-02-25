import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Screen } from '../../menu-creator/entities/screen.entity';

@Entity('rolepermission')
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column()
  roleId: number;

  // @ManyToOne(() => Screen)
  // screen: Screen;

  @Column()
  screenId: number;

  @Column('json')
  actionIds: string[];
}
