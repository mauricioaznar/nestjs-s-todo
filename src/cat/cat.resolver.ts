import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CatService } from './cat.service';
import { Cat, CatInput } from './cat.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import * as crypto from 'crypto';
import { FilesService } from '../files/files.service';

@Resolver()
export class CatResolver {
  constructor(
    private readonly catService: CatService,
    private readonly fileService: FilesService,
  ) {}

  @Query((returns) => [Cat])
  @UseGuards(GqlAuthGuard)
  async cats() {
    return this.catService.findAll();
  }

  @Mutation((returns) => Cat)
  async createCat(@Args('catInput') input: CatInput) {
    return this.catService.create(input);
  }

  @Mutation((returns) => Cat)
  async updateCat(@Args('_id') id: string, @Args('catInput') input: CatInput) {
    return this.catService.update(id, input);
  }

  @Mutation((returns) => Cat)
  async deleteCat(@Args('_id') id: string) {
    return this.catService.delete(id);
  }

  @Mutation(() => Boolean)
  async uploadCatPhotos(
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    filePromises: FileUpload[],
  ) {
    try {
      const files = await Promise.all(filePromises);

      for (const file of files) {
        const fileHash = crypto.randomBytes(20).toString('hex');
        await this.fileService.createFile(
          file.createReadStream,
          `${fileHash}-${file.filename}`,
        );
      }
    } catch (e) {
      return e;
    }

    return true;
  }
}
