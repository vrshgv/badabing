import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Screening } from './screening.entity';
import { User } from '../users/user.entity';
import { Attendance } from '../attendances/attendances.entity';
import { CreateScreeningDto, ListScreeningsQueryDto } from './screening.dto';
import { ScreeningResponse, ScreeningDetail, ScreeningListItem, Page } from '@badabing/shared';
import { toScreeningResponse, toScreeningDetail, toScreeningListItem } from './screenings.mapper';

const DEFAULT_LIMIT = 20;

function encodeCursor(startsAt: Date, id: string): string {
  return Buffer.from(`${startsAt.toISOString()}|${id}`).toString('base64url');
}

function decodeCursor(raw: string): { startsAt: Date; id: string } {
  const [startsAt, id] = Buffer.from(raw, 'base64url').toString().split('|');
  const date = new Date(startsAt);
  if (isNaN(date.getTime()) || !id) {
    throw new BadRequestException('Invalid cursor');
  }
  return { startsAt: date, id };
}

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

  async findAll(dto: ListScreeningsQueryDto): Promise<Page<ScreeningListItem>> {
    const limit = dto.limit ?? DEFAULT_LIMIT;

    const qb = this.screenings
    .createQueryBuilder('s')
    .where('s.cancelledAt IS NULL')
    .andWhere('s.startsAt > now()')
    .orderBy('s.startsAt', 'ASC')
    .addOrderBy('s.id', 'ASC')
    .take(limit + 1);

    if (dto.cursor) {
      const { startsAt, id } = decodeCursor(dto.cursor);
      qb.andWhere('(s.startsAt, s.id) > (:startsAt, :id)', { startsAt, id });
    }

    const rows = await qb.getMany();

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    const screeningIds = items.map(s => s.id);
    let attendedIds = new Set<string>();

    if (!screeningIds.length) {
      return { items: [], nextCursor: null };
    }

    const attendances = await this.attendances
    .createQueryBuilder('a')
    .select('a.screeningId', 'screeningId')
    .addSelect('COUNT(*)', 'count')
    .where('a.screeningId IN (:...screeningIds)', { screeningIds })
    .andWhere('a.status = :status', { status: 'confirmed'})
    .groupBy('a.screeningId')
    .getRawMany<{ screeningId: string, count: string }>();

    const confirmedCounts = new Map(attendances.map(a => [a.screeningId, Number(a.count)]));

    if (dto.viewerId) {
      const found = await this.attendances.find(
        {
          select: { screeningId: true },
          where: { screeningId: In(screeningIds), userId: dto.viewerId }
        }
      )

      attendedIds = new Set(found.map(a => a.screeningId));
    }

    const nextCursor = hasMore ? encodeCursor(items[items.length - 1].startsAt, items[items.length - 1].id) : null;

    return { items: items.map(s => toScreeningListItem(s, confirmedCounts.get(s.id) ?? 0, attendedIds.has(s.id))), nextCursor };
  }

  async findOne(id: string, viewerId?: string): Promise<ScreeningDetail> {
    const screening = await this.screenings.findOneBy({ id });

    if (!screening) {
      throw new NotFoundException(`Screening with id ${id} does not exist`);
    }

    const rows = await this.attendances.find({
      where: { screeningId: id },
      relations: { user: true },
      order: { position: 'ASC', createdAt: 'ASC'}
    });

    return toScreeningDetail(screening, rows, viewerId);
  }
}
