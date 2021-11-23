import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoInput, TodoQueryArgs } from './todo.dto';
import { TodoDocument } from './todo.schema';
import { User } from '../auth/auth.dto';
import moment from 'moment';

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
      items: undefined,
      due: undefined,
    };

    if (todoQueryArgs?.due) {
      const split = todoQueryArgs.due.split('-');
      const year = Number(split[0]);
      const month = Number(split[1]);
      const gte = moment()
        .year(year)
        .month(month - 1)
        .startOf('month')
        .format('YYYY-MM-DD');
      const lt = moment()
        .year(year)
        .month(month - 1)
        .add(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD');
      filter.due = {
        $gte: gte,
        $lt: lt,
      };
    } else {
      delete filter.due;
    }

    if (
      todoQueryArgs?.completed === true ||
      todoQueryArgs?.completed === false
    ) {
      if (todoQueryArgs?.completed === true) {
        filter['items'] = {
          $not: {
            $elemMatch: {
              completed: false,
            },
          },
        };
      } else if (todoQueryArgs?.completed === false) {
        filter['items'] = {
          $elemMatch: {
            completed: false,
          },
        };
      }
    } else {
      delete filter['items'];
    }

    const query = this.todoModel.find(filter);

    if (limit) {
      query.limit(limit);
    }

    if (offset) {
      query.skip(offset);
    }

    if (todoQueryArgs.order && todoQueryArgs.orderBy) {
      query.sort({
        [todoQueryArgs.orderBy]: todoQueryArgs.order === 'asc' ? 1 : -1,
      });
    } else {
      query.sort({ _id: -1 });
    }

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
