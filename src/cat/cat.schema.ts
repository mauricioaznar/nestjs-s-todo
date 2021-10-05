import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field } from '@nestjs/graphql';

class Characteristics {
  @Field(() => String)
  lifespan: string;

  @Field(() => String)
  size: 'small' | 'medium' | 'large';

  @Field(() => String)
  coat: 'short' | 'medium' | 'long';

  @Field(() => String)
  color: string;
}

@Schema()
export class Cat {
  @Field(() => String)
  @Prop()
  readonly id: string;

  @Field(() => String)
  @Prop()
  breed: string;

  @Prop()
  characteristics: Characteristics;
}

export type CatDocument = Cat & Document;
export const CatSchema = SchemaFactory.createForClass(Cat);
