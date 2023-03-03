import { Controller, Get, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { AppService } from './app.service';

@Controller('/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  users(): Promise<User[]> {
    return this.appService.users();
  }

  @Get(':userId')
  user(@Param('userId') userId: string): Promise<User> {
    return this.appService.user(parseInt(userId, 10));
  }
}
