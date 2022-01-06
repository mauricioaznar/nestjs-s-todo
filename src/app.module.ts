import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';
import { GraphQLModule } from '@nestjs/graphql';
import { CatModule } from './modules/forms-program/cat/cat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/utilities-program/todo/todo.module';
import { ApolloError } from 'apollo-server-express';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { IsYearMonth } from './modules/common/class-validator/is-year-month';
import { FilesModule } from './modules/files/files.module';
import { MemoryTokenModule } from './modules/common/services/memory-token/memory-token.module';
import { NoteModule } from './modules/utilities-program/note/note.module';
import { UtilitiesProgramModule } from './modules/utilities-program/utilities-program.module';
import { FormsProgramModule } from './modules/forms-program/forms-program.module';

if (!process.env.MONGO_DATABASE) {
  throw new Error('process.env.MONGO_DATABASE is not defined');
}

if (!process.env.MONGO_URL) {
  throw new Error('process.env.MONGO_URL is not defined');
}

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            if (!connectionParams.authorization) {
              throw new ApolloError(
                `Send 'authorization' property with an appropriate token in connection with websockets`,
              );
            }
            return { connectionParams };
          },
        },
      },
      formatError: (error: any) => {
        if (error instanceof GraphQLError) {
          const graphQLFormattedError: GraphQLFormattedError = {
            message:
              error.extensions?.exception?.response?.messag || error.message,
          };
          return graphQLFormattedError;
        } else if (error instanceof ApolloError) {
          if (!!error?.extensions?.response?.message) {
            return {
              message: error.extensions.response.message,
            };
          } else {
            return {
              message: error.message,
            };
          }
        }
      },
      context: (ctx) => {
        return ctx.connection
          ? { ...ctx, req: ctx.connection.context }
          : { ...ctx, req: ctx.req };
      },
    }),
    MongooseModule.forRoot(
      `${process.env.MONGO_URL}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
      {
        ignoreUndefined: true,
      },
    ),
    CacheModule.register({ ttl: 0, isGlobal: true }),
    AuthModule,
    FormsProgramModule,
    UtilitiesProgramModule,
    MemoryTokenModule,
    FilesModule,
    IsYearMonth,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        graphqlUploadExpress({
          maxFileSize: 4000000,
          maxFiles: 3,
        }),
      )
      .forRoutes('graphql');
  }
}
