import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { User } from '../../auth/auth.dto';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class NoteBase {
  @Field()
  title: string;

  @Field()
  markdownContent: string;
}

@InputType('NoteInput')
export class NoteInput extends NoteBase {}

@ObjectType('Note')
export class Note extends NoteBase {
  @Field({ nullable: false })
  readonly id: number;

  @Field()
  authorId?: string;

  @Field()
  author?: User;
}
