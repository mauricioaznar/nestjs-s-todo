import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@ObjectType('Characteristics')
@InputType('CharacteristicsInput')
class Characteristics {
  @Field()
  @Prop()
  lifespan: string;

  @Field()
  @Prop()
  size: 'small' | 'medium' | 'large';

  @Field()
  @Prop()
  coat: 'short' | 'medium' | 'long';

  @Field()
  @Prop()
  color: string;
}

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class CatBase {
  @Field()
  @Prop()
  breed: string;

  @Field()
  @Prop()
  characteristics: Characteristics;
}

@InputType('CatInput')
export class CatInput extends CatBase {}

@ObjectType('Cat')
@Schema()
export class Cat extends CatBase {
  @Field({ nullable: false })
  readonly _id: string;

  @Field(() => [String])
  @Prop()
  filenames: string[];

  @Field(() => [String])
  files: string[];
}
