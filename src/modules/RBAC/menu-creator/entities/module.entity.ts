import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Screen } from './screen.entity'; 

@Entity()
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  route: string;

  @Column({ nullable: true })
  parentModuleId: number;

  @OneToMany(() => Screen, screen => screen.module)
  screens: Screen[];

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: false })
  systemDefault: boolean;
}
