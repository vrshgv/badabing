import { Controller } from '@nestjs/common';
import { ScreeningsService } from './screenings.service';
import { Post, Body } from '@nestjs/common';
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
}
