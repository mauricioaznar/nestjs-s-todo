import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, LoginInput, User, UserInput } from './auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { UserDocument } from './auth.schema';
import * as bcrypt from 'bcrypt';

export type UserSchema = any;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findOneByUsername({ username });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }
    return user;
  }

  async login(userInput: LoginInput): Promise<AccessToken> {
    const res = await this.validateUser(userInput.username, userInput.password);
    if (res) {
      const { password, ...rest } = res;
      console.log({ ...rest });
      console.log(rest);
      return {
        accessToken: this.jwtService.sign({ ...rest }),
      };
    } else {
      return null;
    }
  }

  async findOneByUsername({
    username,
  }: {
    username: string;
  }): Promise<UserSchema | undefined> {
    return this.userModel
      .findOne({
        username: username,
      })
      .lean();
  }

  async findOneByToken(args: {
    connectionParams: {
      authorization: string;
    };
  }): Promise<UserSchema | undefined> {
    const token = args.connectionParams.authorization.split(' ')[1];
    const result = this.jwtService.decode(token) as { username: string };
    return this.userModel
      .findOne({
        username: result.username,
      })
      .lean();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async findOneByUser({
    user,
  }: {
    user: string | mongoose.Schema.Types.ObjectId | UserDocument;
  }) {
    return this.userModel.findOne({ _id: user });
  }

  async create(userInput: UserInput): Promise<User> {
    const saltOrRounds = 10;
    const password = await bcrypt.hash(userInput.password, saltOrRounds);
    const createdUser = new this.userModel({
      ...userInput,
      password,
    });
    return createdUser.save();
  }

  async update(
    _id: string | mongoose.Schema.Types.ObjectId | UserDocument,
    userInput: UserInput,
  ): Promise<User> {
    const saltOrRounds = 10;
    const password = await bcrypt.hash(userInput.password, saltOrRounds);
    return this.userModel.findOneAndUpdate(
      {
        _id: _id,
      },
      { ...userInput, password },
    );
  }
}
