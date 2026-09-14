import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ScreeningsService } from './screenings.service';
import { ScreeningResponse } from '@badabing/shared';
import { CreateScreeningDto } from './screening.dto';
@Controller('screenings')
export class ScreeningsController {
  constructor(
    private readonly screeningsService: ScreeningsService
  ){}

  @Post()
  create(@Body() dto: CreateScreeningDto): Promise<ScreeningResponse> {
    return this.screeningsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ScreeningResponse> {
    return this.screeningsService.findOne(id);
  }
}
