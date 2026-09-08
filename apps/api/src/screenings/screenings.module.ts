import { Module } from '@nestjs/common';
import { ScreeningsController } from './screenings.controller';
import { ScreeningsService } from './screenings.service';
import { Screening } from './screening.entity';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ScreeningsController],
  providers: [ScreeningsService],
  imports: [TypeOrmModule.forFeature([Screening, User])],
})
export class ScreeningsModule {}
