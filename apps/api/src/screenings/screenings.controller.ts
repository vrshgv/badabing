import { Controller, Get, Post, Delete, Body, Param, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ScreeningsService } from './screenings.service';
import { ScreeningResponse, ScreeningDetail, Page, ScreeningListItem } from '@badabing/shared';
import { CreateScreeningDto, ListScreeningsQueryDto, CancelScreeningDto } from './screening.dto';
@Controller('screenings')
export class ScreeningsController {
  constructor(
    private readonly screeningsService: ScreeningsService
  ){}

  @Post()
  create(@Body() dto: CreateScreeningDto): Promise<ScreeningResponse> {
    return this.screeningsService.create(dto);
  }

  @Get()
  findAll(@Query() queryDto: ListScreeningsQueryDto): Promise<Page<ScreeningListItem>> {
    return this.screeningsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string, 
    @Query('viewerId', new ParseUUIDPipe({ optional: true })) viewerId?: string): Promise<ScreeningDetail> {
    return this.screeningsService.findOne(id, viewerId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: CancelScreeningDto
  ): Promise<void> {
    return this.screeningsService.cancel(id, query.hostId);
  }
}
