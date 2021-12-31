import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoteService } from './note.service';
import { Note, NoteInput } from './note.dto';
import { User } from '../auth/auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Note)
export class NoteResolver {
  constructor(private readonly noteService: NoteService) {}

  @Query(() => [Note])
  @UseGuards(GqlAuthGuard)
  async notes(@CurrentUser() currentUser: User) {
    return this.noteService.getNotes();
  }

  @Mutation(() => Note)
  @UseGuards(GqlAuthGuard)
  async createNote(@Args('noteInput') input: NoteInput) {
    return this.noteService.create(input);
  }

  @Mutation(() => Note)
  @UseGuards(GqlAuthGuard)
  async updateNote(
    @Args('id') id: number,
    @Args('noteInput') input: NoteInput,
  ) {
    return this.noteService.update(id, input);
  }
}
