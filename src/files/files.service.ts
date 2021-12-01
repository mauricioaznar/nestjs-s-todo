import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@Injectable()
export class FilesService {
  async getFile(fileName: string) {
    const filepath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      'images',
      `two.jpg`,
    );
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(filepath, {}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
