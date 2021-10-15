import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {AccessToken, User, UserInput} from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userInput: UserInput): Promise<AccessToken> {

    const res = await this.validateUser(userInput.username, userInput.password)
    if (res) {
      const payload = { username: userInput.username, password: userInput.password };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      return null
    }
  }


}
