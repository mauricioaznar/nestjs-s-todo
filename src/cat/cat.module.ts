import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatResolver } from './cat.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from './cat.schema';
import { Cat } from './cat.dto';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    FilesModule,
  ],
  providers: [CatService, CatResolver],
})
export class CatModule {}
