import {Field, InputType, ObjectType} from "@nestjs/graphql";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class UserBase {
    @Field()
    username: string;

    @Field()
    password: string;
}

@InputType('userInput')
export class UserInput extends UserBase {}

@ObjectType('User')
export class User extends UserBase {
    @Field({nullable: false})
    _id: string;
}


@ObjectType('AccessToken')
export class AccessToken {
    @Field({nullable: false})
    accessToken: string;
}
