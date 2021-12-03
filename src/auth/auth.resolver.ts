import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthenticationError } from 'apollo-server-core';
import { AccessToken, LoginInput, User, UserInput } from './auth.dto';
import { CACHE_MANAGER, Inject, Injectable, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ForbiddenError } from 'apollo-server-express';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { MemoryTokenService } from '../memory-token/memory-token.service';
import { Cache } from 'cache-manager';
import { FilesService } from '../files/files.service';

@Resolver(() => User)
@Injectable()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private memoryTokenService: MemoryTokenService,
    private filesService: FilesService,
  ) {}

  @Mutation(() => AccessToken)
  async login(@Args('loginInput') input: LoginInput) {
    const result = await this.authService.login(input);
    if (result) return result;
    throw new AuthenticationError(
      'Could not log-in with the provided credentials',
    );
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async currentUser(@CurrentUser() currentUser: User) {
    return this.authService.findOneByUsername({
      username: currentUser.username,
    });
  }

  // todo delete file if exists
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
    @Args('userId') userId: string,
    @CurrentUser() currentUser: User,
  ) {
    const { filename, mimetype, encoding, createReadStream } = file;
    // console.log('attachment:', filename, mimetype, encoding);

    if (userId.toString() !== currentUser._id && !currentUser.admin) {
      return new ForbiddenError('Not allowed');
    }

    const user = await this.authService.findOneByUser({ user: userId });

    const oldAvatar = user.avatar;
    if (oldAvatar) {
      await this.filesService.deleteFileIfExists(oldAvatar);
    }

    const newFileName = `${userId}-${filename}`;

    await this.authService.updateAvatar(userId, newFileName);
    return this.filesService.createFile(createReadStream, newFileName);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async createUser(
    @Args('userInput') input: UserInput,
    @CurrentUser() currentUser: User,
  ) {
    if (!currentUser.admin) {
      return new ForbiddenError('Not allowed');
    }
    return this.authService.create(input);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('_id') id: string,
    @Args('userInput') input: UserInput,
    @CurrentUser() currentUser: User,
  ) {
    const oldUser = await this.authService.findOneByUser({ user: id });
    if (oldUser._id.toString() !== currentUser._id && !currentUser.admin) {
      return new ForbiddenError('Not allowed');
    }
    return this.authService.update(id, {
      ...input,
      admin: currentUser.admin ? input.admin : false,
    });
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async users(@CurrentUser() currentUser: User) {
    return this.authService.findAll();
  }

  @ResolveField('avatar', () => String)
  async avatar(
    @Parent() user: User,
    @CurrentUser() currentUser,
    @Context() ctx,
  ): Promise<string> {
    const token = await this.memoryTokenService.getToken(currentUser._id);
    if (!user.avatar || user.avatar === '') {
      return null;
    }
    return `${ctx.req.headers.origin}/files/${token}/${user.avatar}`;
  }

  // // There is no username guard here because if the person has the token, they can be any user
  // @Query('refreshToken')
  // @UseGuards(JwtAuthGuard)
  // async refreshToken(@Context('req') request: any): Promise<string> {
  //     const user: UserDocument = request.user;
  //     if (!user)
  //         throw new AuthenticationError(
  //             'Could not log-in with the provided credentials',
  //         );
  //     const result = await this.authService.createJwt(user);
  //     if (result) return result.token;
  //     throw new AuthenticationError(
  //         'Could not log-in with the provided credentials',
  //     );
  // }
}
