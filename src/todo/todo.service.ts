import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Todo, TodoInput} from "./todo.dto";
import {TodoDocument} from "./todo.schema";

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async findAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async create(createTodoDto: TodoInput): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    return createdTodo.save();
  }

  async update(id: string, updateTodoDto: TodoInput): Promise<Todo> {
    return this.todoModel.findByIdAndUpdate(id, updateTodoDto);
  }

  async delete(id: string): Promise<Todo> {
    return this.todoModel.findByIdAndDelete(id);
  }
}
