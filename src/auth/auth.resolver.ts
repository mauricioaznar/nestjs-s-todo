import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AuthService} from './auth.service';
import {AuthenticationError} from 'apollo-server-core';
import {AccessToken, User, UserInput} from "./auth.dto";
import {UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "./guards/gql-auth.guard";
import {CurrentUser} from "./decorators/current-user.decorator";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation((returns) => AccessToken)
    async login(@Args('userInput') input: UserInput) {
        const result = await this.authService.login(input);
        if (result) return result;
        throw new AuthenticationError(
            'Could not log-in with the provided credentials',
        );
    }

    @Query((returns) => User)
    @UseGuards(GqlAuthGuard)
    async currentUser(@CurrentUser() currentUser: User) {
        return this.authService.findOneByUsername({ username: currentUser.username });
    }

    @Mutation((returns) => User)
    async createUser(@Args('userInput') input: UserInput) {
        return this.authService.create(input);
    }

    @Query((returns) => [User])
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
