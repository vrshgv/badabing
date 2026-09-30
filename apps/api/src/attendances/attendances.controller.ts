import { Controller, Post, Body, Param, ParseUUIDPipe, Delete, HttpCode, HttpStatus } from '@nestjs/common';
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

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancel(
    @Param('screeningId', ParseUUIDPipe) screeningId: string,
    @Param('userId', ParseUUIDPipe) userId: string
  ): Promise<void> {
    return this.attendancesService.cancel(screeningId, userId)
  }
}