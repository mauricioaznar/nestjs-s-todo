import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthenticationError } from 'apollo-server-core';
import { AccessToken, LoginInput, User, UserInput } from './auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ForbiddenError } from 'apollo-server-express';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

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
  async users() {
    return this.authService.findAll();
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
