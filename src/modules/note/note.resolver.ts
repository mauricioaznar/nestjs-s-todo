import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoteService } from './note.service';
import { Note, NoteInput } from './note.dto';
import { FilesService } from '../files/files.service';
import { MemoryTokenService } from '../common/services/memory-token/memory-token.service';
import { User } from '../auth/auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Cat, CatInput } from '../cat/cat.dto';

@Resolver(() => Note)
export class NoteResolver {
  constructor(
    private readonly noteService: NoteService,
    private readonly filesService: FilesService,
    private readonly memoryTokenService: MemoryTokenService,
  ) {}

  @Query(() => [Note])
  @UseGuards(GqlAuthGuard)
  async getNotes(@CurrentUser() currentUser: User) {
    return this.noteService.getNotes();
  }

  @Mutation(() => Note)
  @UseGuards(GqlAuthGuard)
  async createNote(@Args('noteInput') input: NoteInput) {
    return this.noteService.create(input);
  }
}
