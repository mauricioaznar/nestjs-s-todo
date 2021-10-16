import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import {AuthenticationError} from "apollo-server-core";

export class GqlAuthGuard extends AuthGuard("jwt") {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new AuthenticationError('Could not authenticate with token');
        }
        return user;
    }
}
