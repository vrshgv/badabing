import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screening } from './screening.entity';
import { User } from '../users/user.entity';
import { Attendance } from '../attendances/attendances.entity';
import { CreateScreeningDto } from './screening.dto';
import { ScreeningResponse, ScreeningDetail } from '@badabing/shared';
import { toScreeningResponse, toScreeningDetail } from './screenings.mapper';
@Injectable()
export class ScreeningsService {
  constructor(
    @InjectRepository(Screening)
    private readonly screenings: Repository<Screening>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Attendance)
    private readonly attendances: Repository<Attendance>
  ){}

  async create(dto: CreateScreeningDto): Promise<ScreeningResponse> {
    const hostExists = await this.users.existsBy({ id: dto.hostId});
    if (!hostExists) {
      throw new BadRequestException(`Host with id ${dto.hostId} does not exist`);
    }

    const screening = this.screenings.create({
      title: dto.title,
      description: dto.description,
      capacity: dto.capacity,
      location: dto.location,
      hostId: dto.hostId,
      startsAt: new Date(dto.startsAt),
      posterUrl: dto.posterUrl ?? null,
      year: dto.year ?? null,
      runtimeMinutes: dto.runtimeMinutes ?? null,
      cancelledAt: null,
    });

    return toScreeningResponse(await this.screenings.save(screening));
  }

  async findOne(id: string): Promise<ScreeningDetail> {
    const screening = await this.screenings.findOneBy({ id });

    if (!screening) {
      throw new NotFoundException(`Screening with id ${id} does not exist`);
    }

    const rows = await this.attendances.find({
      where: { screeningId: id },
      relations: { user: true },
      order: { position: 'ASC', createdAt: 'ASC'}
    });

    return toScreeningDetail(screening, rows);
  }
}