import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Todo } from './todo.dto';

export type TodoDocument = Todo & Document;
export const TodoSchema = SchemaFactory.createForClass(Todo);
