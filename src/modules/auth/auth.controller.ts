import {
  Controller,
  Body,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../user/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiCreatedResponse({ type: UserEntity })
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('registration')
  @ApiCreatedResponse({ type: UserEntity })
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('is_auth')
  isAuth() {
    return { message: 'token is life' };
  }
}
