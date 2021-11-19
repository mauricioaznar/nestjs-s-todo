import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoInput, TodoQueryArgs } from './todo.dto';
import { TodoDocument } from './todo.schema';
import { User } from '../auth/auth.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async findOne(options: { _id: string }) {
    return this.todoModel.findById(options._id).exec();
  }

  async findAll(options: {
    user: User;
    todoQueryArgs?: TodoQueryArgs;
    limit?: number;
    offset?: number;
  }): Promise<{ todos: Todo[]; count: number }> {
    const { user, todoQueryArgs, limit, offset } = options;

    const filter = {
      archived: todoQueryArgs?.archived,
      completed: todoQueryArgs?.completed,
      due: todoQueryArgs?.due,
    };

    if (!todoQueryArgs?.due) {
      delete filter.due;
    }

    const query = this.todoModel.find(filter);

    if (limit) {
      query.limit(limit);
    }

    if (offset) {
      query.skip(offset);
    }

    query.sort({ _id: -1 });

    const todos = await query.exec();
    const count = await this.todoModel.countDocuments(filter);

    return {
      todos,
      count,
    };

    // user: options.user._id,
  }

  async create(createTodoDto: TodoInput, user: User): Promise<Todo> {
    const todoData = {
      ...createTodoDto,
      user: user._id,
    };
    console.log(todoData);
    const createdTodo = new this.todoModel(todoData);
    return createdTodo.save();
  }

  async update(id: string, updateTodoDto: TodoInput): Promise<Todo> {
    console.log(updateTodoDto);
    return this.todoModel.findByIdAndUpdate(id, updateTodoDto);
  }

  async delete(id: string): Promise<Todo> {
    return this.todoModel.findByIdAndDelete(id);
  }
}
