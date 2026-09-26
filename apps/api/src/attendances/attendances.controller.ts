import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { ClaimSeatDto } from './attendances.dto';
import { AttendanceResponse } from '@badabing/shared';

@Controller('screenings/:screeningId/attendances')
export class AttendancesController {
  constructor(
    private readonly attendancesService: AttendancesService
  ){}

  @Post()
  claim(
    @Param('screeningId', ParseUUIDPipe) screeningId: string,
    @Body() dto: ClaimSeatDto
  ): Promise<AttendanceResponse>{
    return this.attendancesService.claim(screeningId, dto.userId);
  }
}