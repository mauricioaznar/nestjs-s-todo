import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { NoteService } from './note.service';
import { Note, NoteInput, NoteOffsetResponse } from './note.dto';
import { User } from '../../auth/auth.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { AuthService } from '../../auth/auth.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import OffsetPaginatorArgs from '../../common/dto/offset-paginator/offset-paginator-args';

@Resolver(() => Note)
export class NoteResolver {
  constructor(
    private readonly noteService: NoteService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => NoteOffsetResponse)
  @UseGuards(GqlAuthGuard)
  async notes(
    @Args() offsetPaginatorArgs: OffsetPaginatorArgs,
  ): Promise<NoteOffsetResponse> {
    const notes = await this.noteService.getNotes(offsetPaginatorArgs);
    const count = await this.noteService.getCount();
    return {
      notes,
      count,
    };
  }

  @Mutation(() => Note)
  @UseGuards(GqlAuthGuard)
  async createNote(
    @Args('noteInput') input: NoteInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.noteService.create(input, currentUser._id);
  }

  @Mutation(() => Note)
  @UseGuards(GqlAuthGuard)
  async updateNote(
    @Args('id') id: number,
    @Args('noteInput') input: NoteInput,
    @CurrentUser() currentUser: User,
  ) {
    const note = await this.noteService.getNoteById(id);
    if (currentUser._id !== note.authorId) {
      throw new BadRequestException('You are not the author of this note.');
    }
    return this.noteService.update(id, input);
  }

  @Mutation(() => Note)
  @UseGuards(GqlAuthGuard)
  async deleteNote(@Args('id') id: number, @CurrentUser() currentUser: User) {
    const note = await this.noteService.getNoteById(id);
    if (currentUser._id !== note.authorId) {
      throw new BadRequestException('You are not the author of this note.');
    }
    return this.noteService.delete(id);
  }

  @ResolveField('author', () => User, { nullable: true })
  async user(@Parent() note: Note): Promise<User> {
    const userId = note.authorId;
    return this.authService.findOneByUser({ user: userId });
  }
}
