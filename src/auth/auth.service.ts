import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {AccessToken, User, UserInput} from "./auth.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {UserDocument} from "./auth.schema";
import * as bcrypt from 'bcrypt';

export type UserSchema = any;

@Injectable()
export class AuthService {
  constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findOne(username);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }
    const { password, ...result } = user;
    return result;
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

  async findOne(username: string): Promise<UserSchema | undefined> {
    return this.userModel.findOne({
      username: username
    }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(userInput: UserInput): Promise<User> {
    const saltOrRounds = 10;
    const password = await bcrypt.hash(userInput.password, saltOrRounds);
    const createdUser = new this.userModel({
      ...userInput,
      password
    });
    return createdUser.save();
  }

}
