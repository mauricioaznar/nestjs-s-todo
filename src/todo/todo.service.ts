import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoInput } from './todo.dto';
import { TodoDocument } from './todo.schema';
import { User } from '../auth/auth.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async findAll(options: { user: User }): Promise<Todo[]> {
    console.log(options.user);
    const todos = await this.todoModel
      .find({
        user: options.user._id,
      })
      .exec();
    console.log(todos);
    return todos;
  }

  async create(createTodoDto: TodoInput, user: User): Promise<Todo> {
    const todoData = {
      ...createTodoDto,
      user: user._id,
    };
    const createdTodo = new this.todoModel(todoData);
    return createdTodo.save();
  }

  async update(id: string, updateTodoDto: TodoInput): Promise<Todo> {
    return this.todoModel.findByIdAndUpdate(id, updateTodoDto);
  }

  async delete(id: string): Promise<Todo> {
    return this.todoModel.findByIdAndDelete(id);
  }
}
