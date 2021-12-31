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

  async getNoteById(id: number) {
    return this.prisma.note.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(noteInput: NoteInput, userId: string) {
    return this.prisma.note.create({
      data: {
        ...noteInput,
        authorId: userId,
      },
    });
  }

  async update(id: number, noteInput: NoteInput) {
    return this.prisma.note.update({
      data: noteInput,
      where: {
        id: id,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.note.delete({
      where: {
        id: id,
      },
    });
  }
}
