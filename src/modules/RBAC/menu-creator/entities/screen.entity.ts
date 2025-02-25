import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , JoinTable } from 'typeorm';
import { Module } from './module.entity'; 
import { Action } from '../../actions/entities/action.entity';

@Entity()
export class Screen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  route: string;

  @Column('json')
  actionIds: number[];

  @ManyToOne(() => Module, module => module.screens)
  module: Module;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: false })
  systemDefault: boolean;

  @JoinTable({
    name: 'screen_actions', // Join table name
    joinColumn: {
      name: 'screenId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'actionId',
      referencedColumnName: 'id',
    },
  })
  actions: Action[];
}
