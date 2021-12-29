import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteResolver } from './note.resolver';
import { FilesModule } from '../files/files.module';
import { MemoryTokenModule } from '../common/services/memory-token/memory-token.module';
import { PrismaService } from '../common/services/prisma/prisma.service';

@Module({
  imports: [FilesModule, MemoryTokenModule],
  providers: [NoteService, NoteResolver, PrismaService],
})
export class NoteModule {}
