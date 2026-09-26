import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Attendance } from './attendances.entity';
import { Screening } from '../screenings/screening.entity';
import { User } from '../users/user.entity';
import { DataSource, QueryFailedError } from 'typeorm';
import { AttendanceResponse, AttendanceStatus } from '@badabing/shared';
import { toAttendanceResponse } from './attendances.mapper';

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class AttendancesService {
  constructor(
    private readonly dataSource: DataSource,
  ){}
  
  async claim(screeningId: string, userId: string): Promise<AttendanceResponse> {
    try {
      return  await this.dataSource.transaction(
        async (manager) => {
          const screening = await manager.findOne(Screening, {
            where: { id: screeningId },
            lock: { mode: 'pessimistic_write' }
          });

          if (!screening) {
            throw new NotFoundException(`Screening with id ${screeningId} not found`);
          }

          if (screening.cancelledAt) {
            throw new ConflictException(`Screening with id ${screeningId} is cancelled`);
          }

          if (screening.startsAt <= new Date()) {
            throw new ConflictException(`Screening with id ${screeningId} has already started`);
          }

          const userExists = await manager.existsBy(User, {
            id: userId
          })

          if (!userExists) {
            throw new BadRequestException('User does not exist');
          }

          const confirmedCount = await manager.countBy(Attendance, {
            screeningId,
            status: 'confirmed'
          })

          const status: AttendanceStatus = confirmedCount < screening.capacity ? 'confirmed' : 'waitlisted';
          
          let position: number | null = null;

          if (status === 'waitlisted') {
            const row = await manager
              .createQueryBuilder(Attendance, 'a')
              .select('MAX(a.position)', 'max')
              .where('a.screeningId = :screeningId', { screeningId })
              .andWhere('a.status = :status', { status })
              .getRawOne<{ max: number | null }>();

            position = (row?.max ?? 0) + 1;
          }

          const attendance = await manager.save(
            manager.create(Attendance, {
              screeningId,
              userId,
              status,
              position
            })
          )

          return toAttendanceResponse(attendance);
        }
      )
    } catch (err) {
      if (err instanceof QueryFailedError
        && (err.driverError as { code?: string }).code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException(`User ${userId} already claimed a seat`);
      }
      throw err;
    }
  }
}