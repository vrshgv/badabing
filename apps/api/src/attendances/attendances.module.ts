import { Module } from '@nestjs/common';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { Attendance } from './attendances.entity';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screening } from '../screenings/screening.entity';

@Module({
  controllers: [AttendancesController],
  providers: [AttendancesService],
  imports: [TypeOrmModule.forFeature([Attendance, User, Screening])]
})
export class AttendancesModule {}