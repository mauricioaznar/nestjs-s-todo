import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class NoteBase {
  @Field()
  title: string;

  @Field()
  description: string;
}

@InputType('NoteInput')
export class NoteInput extends NoteBase {}

@ObjectType('Note')
export class Note extends NoteBase {
  @Field({ nullable: false })
  readonly id: string;
}
