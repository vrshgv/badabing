import { Injectable } from '@nestjs/common';
import { Screening } from './screening.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateScreeningDto } from './screening.dto';
import { ScreeningResponse } from '@badabing/shared';
import { BadRequestException } from '@nestjs/common';
import { toScreeningResponse } from './screenings.mapper';
@Injectable()
export class ScreeningsService {
  constructor(
    @InjectRepository(Screening)
    private readonly screenings: Repository<Screening>,
    @InjectRepository(User)
    private readonly users: Repository<User>
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
}