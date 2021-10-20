import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { User } from '../auth/auth.dto';
import * as mongoose from 'mongoose';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class TodoBase {
  @Field()
  @Prop()
  description: string;

  @Field()
  @Prop()
  due: string;

  @Field()
  @Prop()
  completed: boolean;
}

@InputType('TodoInput')
export class TodoInput extends TodoBase {}

@ObjectType('Todo')
@Schema()
export class Todo extends TodoBase {
  @Field({ nullable: false })
  readonly _id: string;

  @Field((type) => User, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;
}
