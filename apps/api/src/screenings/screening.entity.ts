import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('screenings')
export class Screening {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 600 })
  description: string;

  @Column({type: 'int'})
  capacity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  posterUrl: string | null;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({type: 'int', nullable: true})
  year: number | null;

  @Column({type: 'int', nullable: true})
  runtimeMinutes: number | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'host_id' })
  host: User;

  @Column({ type: 'uuid', name: 'host_id' })
  hostId: string;

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @Index()
  @Column({ type: 'timestamptz' })
  startsAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}