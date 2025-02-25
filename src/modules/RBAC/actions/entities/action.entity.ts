import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
