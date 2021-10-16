import {Query, Resolver} from '@nestjs/graphql';
import {GqlAuthGuard} from "../auth/guards/gql-auth.guard";
import {UseGuards} from "@nestjs/common";
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {User} from "../auth/auth.dto";
import {UsersService} from "./users.service";


@Resolver()
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query((returns) => User)
    @UseGuards(GqlAuthGuard)
    async currentUser(@CurrentUser() currentUser: User) {
        return this.usersService.findOne(currentUser.username);
    }
}
