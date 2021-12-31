import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma/prisma.service';
import { NoteInput } from './note.dto';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {
    //
  }

  async getNotes() {
    return this.prisma.note.findMany();
  }

  async create(noteInput: NoteInput) {
    return this.prisma.note.create({ data: noteInput });
  }

  async update(id: number, noteInput: NoteInput) {
    return this.prisma.note.update({
      data: noteInput,
      where: {
        id: id,
      },
    });
  }
}
