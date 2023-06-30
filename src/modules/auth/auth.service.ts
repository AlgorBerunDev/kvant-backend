import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(contact: string, _password: string): Promise<any> {
    const user = await this.userService.findByIdentity(contact);
    if (user && user.password === _password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      id: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        contact: user.contact,
        username: user.username,
        role: user.role,
      },
    };
  }

  async registration(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
  async isAdmin(username) {
    return this.userService.isAdmin(username);
  }
}
