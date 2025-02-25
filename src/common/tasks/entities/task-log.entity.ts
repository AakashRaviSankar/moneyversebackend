import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('task_log')
export class TaskLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    taskName: string;

    @Column({ default: 'success' })
    status: string;

    @Column({ nullable: true })
    errorMessage: string;

    @Column({ nullable: true })
    attempt?: number;  // Add this line to track retry attempts

    @CreateDateColumn()
    runAt: Date;
}
