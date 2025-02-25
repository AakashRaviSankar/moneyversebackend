import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ schema: "logs", name: "service_log" })
export class ServiceLog {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ length: 50 })
    level: string;

    @Column({ length: 255 })
    context: string;

    @Column('text', { nullable: true })
    message: string;

    @Column('text', { nullable: true })
    request: string;

    @Column('text', { nullable: true })
    response: string;

    @Column('text', { nullable: true })
    error: string;

    @Column('text', { nullable: true })
    sqlexception: string;

    @Column('text', { nullable: true })
    exception: string;
}
