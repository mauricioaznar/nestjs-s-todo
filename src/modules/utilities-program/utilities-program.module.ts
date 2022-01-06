import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [TodoModule, NoteModule],
})
export class UtilitiesProgramModule {}
