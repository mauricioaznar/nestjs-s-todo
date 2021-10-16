import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {AccessToken, User, UserInput} from "./auth.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {UserDocument} from "./auth.schema";

export type UserSchema = any;

@Injectable()
export class AuthService {
  constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findOne(username);
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


  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<UserSchema | undefined> {
    return this.users.find(user => user.username === username);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(userInput: UserInput): Promise<User> {
    const createdUser = new this.userModel(userInput);
    return createdUser.save();
  }

}
