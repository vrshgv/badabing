import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from '@badabing/shared';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ){}

  @Get()
  findAll(): Promise<UserResponse[]> {
    return this.userService.findAll();
  }
}