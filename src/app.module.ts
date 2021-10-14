import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CatModule } from './cat/cat.module';
import { MongooseModule } from '@nestjs/mongoose';
import {AuthModule} from "./auth/auth.module";


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
    }),
    MongooseModule.forRoot(
      `${process.env.MONGO_URL}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    ),
    CatModule,
    AuthModule,
  ],
})
export class AppModule {}
