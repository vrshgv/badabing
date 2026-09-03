import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Screening } from '../screenings/screening.entity';

export type AttendanceStatus = 'confirmed' | 'waitlisted';

@Entity('attendances')
@Unique(['screeningId', 'userId'])
@Index(['screeningId', 'status'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Screening, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;

  @Column({ type: 'uuid', name: 'screening_id' })
  screeningId: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  status: AttendanceStatus;

  @Column({ type: 'int', nullable: true })
  position: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}