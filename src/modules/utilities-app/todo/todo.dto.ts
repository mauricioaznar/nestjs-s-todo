import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { User } from '../../auth/auth.dto';
import * as mongoose from 'mongoose';
import { UserDocument } from '../../auth/auth.schema';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import relayTypes from '../../common/dto/relay.types';
import { Type } from 'class-transformer';
import { ColumnOrder } from '../../common/dto/column-order';
import { IsYearMonth } from '../../common/class-validator/is-year-month';

@ObjectType()
@InputType('TodoItemInput', { isAbstract: true })
export class TodoItem {
  @Field()
  @Prop()
  @MinLength(4)
  description: string;

  @Field()
  @Prop()
  completed: boolean;
}

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class TodoBase {
  @Field()
  @MinLength(4)
  @Prop()
  description: string;

  @Field()
  @MinLength(4)
  @Prop()
  due: string;

  @Field()
  @Prop()
  locked: boolean;

  @Field()
  @Prop()
  archived: boolean;

  @Prop([TodoItem])
  @Field(() => [TodoItem])
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => TodoItem)
  items: TodoItem[];
}

export enum FilterTodoColumn {
  description = 'description',
  due = 'due',
  _id = '_id',
}

@ArgsType()
export class TodoQueryArgs {
  @Field({ nullable: true })
  archived?: boolean;

  @Field({ nullable: true })
  completed?: boolean;

  @Field({ nullable: true })
  @Validate(IsYearMonth)
  @IsOptional()
  due?: string;

  @Field(() => FilterTodoColumn, { nullable: true })
  orderBy?: FilterTodoColumn;

  @Field(() => ColumnOrder, { nullable: true })
  order?: ColumnOrder;
}

@InputType('TodoInput')
export class TodoInput extends TodoBase {}

@ObjectType('Todo')
@Schema({
  toJSON: {
    getters: true,
  },
})
export class Todo extends TodoBase {
  @Field({ nullable: false })
  readonly _id: string;

  @Field({ nullable: true })
  @Prop({
    get: function () {
      const completed = this.items.reduce((acc, curr) => {
        return curr.completed ? acc + 1 : acc;
      }, 0);
      const length = this.items.length;
      return `${completed}/${length}`;
    },
  })
  readonly completed_percentage: string;

  @Field(() => User, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string | mongoose.Schema.Types.ObjectId | UserDocument;
}

registerEnumType(FilterTodoColumn, { name: 'FilterTodoColumn' });

@ObjectType()
export default class TodoResponse extends relayTypes<Todo>(Todo) {}
