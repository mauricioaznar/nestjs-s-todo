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

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class CatBase {
  @Field()
  breed: string;

  @Field()
  characteristics: Characteristics;
}

@InputType('CatInput')
export class CatInput extends CatBase {}

@ObjectType('Cat')
export class Cat extends CatBase {
  @Field({nullable: false})
  _id: string;
}

