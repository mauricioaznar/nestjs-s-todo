import { ObjectType, Field, InputType, ArgsType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { User } from '../auth/auth.dto';
import * as mongoose from 'mongoose';
import { UserDocument } from '../auth/auth.schema';
import { MinLength } from 'class-validator';

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
  completed: boolean;

  @Field()
  @Prop()
  locked: boolean;

  @Field()
  @Prop()
  archived: boolean;
}

@InputType('TodoQueryArgs')
export class TodoQueryArgs {
  @Field({ nullable: true })
  archived?: boolean;
}

@InputType('TodoInput')
export class TodoInput extends TodoBase {}

@ObjectType('Todo')
@Schema()
export class Todo extends TodoBase {
  @Field({ nullable: false })
  readonly _id: string;

  @Field(() => User, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string | mongoose.Schema.Types.ObjectId | UserDocument;
}
