import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserResponse } from '@badabing/shared';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>
  ){}

  async findAll(): Promise<UserResponse[]> {
    return this.users.find({ 
      select: { id: true, name: true, email: true },
      order: { name: 'ASC' }
    });
  }
}