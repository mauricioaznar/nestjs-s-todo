import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoSchema } from './todo.schema';
import { Todo } from './todo.dto';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    AuthModule,
  ],
  providers: [TodoService, TodoResolver],
})
export class TodoModule {}
