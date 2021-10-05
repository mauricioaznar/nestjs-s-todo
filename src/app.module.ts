import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CatModule } from './cat/cat.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@emaily-cluster.dro2u.mongodb.net/nest-super-todo?retryWrites=true&w=majority',
    ),
    CatModule,
  ],
})
export class AppModule {}
