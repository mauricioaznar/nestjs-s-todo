import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType('Characteristics')
@InputType('CharacteristicsInput')
class Characteristics {
  @Field()
  lifespan: string;

  @Field()
  size: 'small' | 'medium' | 'large';

  @Field()
  coat: 'short' | 'medium' | 'long';

  @Field()
  color: string;
}

@InputType('CatInputType')
export class CatInputType {
  @Field()
  breed: string;

  @Field()
  characteristics: Characteristics;
}

@ObjectType('CatType')
@InputType('CatTypeInput')
export class CatType {
  @Field()
  _id: string;

  @Field()
  breed: string;

  @Field()
  characteristics: Characteristics;
}
