import { ObjectType, Field, InputType } from '@nestjs/graphql';
import {Prop, Schema} from "@nestjs/mongoose";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class TodoBase {
  @Field()
  @Prop()
  description: string;
}

@InputType('TodoInput')
export class TodoInput extends TodoBase {}

@ObjectType('Todo')
@Schema()
export class Todo extends TodoBase {
  @Field({nullable: false})
  readonly _id: string;
}

