import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class UserBase {
  @Field()
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  @Field()
  admin: boolean;
}

@InputType('loginInput')
export class LoginInput {
  @Field()
  password: string;

  @Field()
  username: string;
}

@InputType('userInput')
export class UserInput extends UserBase {
  @Field()
  password: string;
}

@ObjectType('User')
@Schema()
export class User extends UserBase {
  @Field({ nullable: false })
  _id: string;

  @Field(() => String, { nullable: true })
  avatar: string;
}

@ObjectType('AccessToken')
export class AccessToken {
  @Field({ nullable: false })
  accessToken: string;
}
