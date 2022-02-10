import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CatService } from './cat.service';
import { Cat, CatInput } from './cat.dto';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import * as crypto from 'crypto';
import { FilesService } from '../../files/files.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { MemoryTokenService } from '../../common/services/memory-token/memory-token.service';

@Resolver(() => Cat)
export class CatResolver {
  constructor(
    private readonly catService: CatService,
    private readonly filesService: FilesService,
    private readonly memoryTokenService: MemoryTokenService,
  ) {}

  @Query(() => [Cat])
  @UseGuards(GqlAuthGuard)
  async cats() {
    return this.catService.findAll();
  }

  @Mutation(() => Cat)
  async createCat(
    @Args('catInput') input: CatInput,
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    filePromises: FileUpload[],
  ) {
    const cat = await this.catService.create(input);
    await this.updateCatFiles(cat._id, filePromises);
    return cat;
  }

  @Mutation(() => Cat)
  async updateCat(
    @Args('_id') id: string,
    @Args('catInput') input: CatInput,
    @Args('filenames', { type: () => [String] }) filenames: string[],
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    filePromises: FileUpload[],
  ) {
    const oldCat = await this.catService.findCat(id);
    const removedFilenames = oldCat.filenames.filter((oldFilename) => {
      return !filenames.find((newFilename) =>
        newFilename.includes(oldFilename),
      );
    });
    for (const file of removedFilenames) {
      await this.catService.removeFilename(id, file);
      await this.filesService.deleteFileIfExists(file);
    }
    await this.updateCatFiles(id, filePromises);
    return this.catService.update(id, input);
  }

  @Mutation(() => Cat)
  async deleteCat(@Args('_id') id: string) {
    return this.catService.delete(id);
  }

  @Mutation(() => Boolean)
  async uploadCatPhotos(
    @Args('_id') id: string,
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    filePromises: FileUpload[],
  ) {
    await this.updateCatFiles(id, filePromises);
    return true;
  }

  @ResolveField('filenames', () => [String])
  async filenames(
    @Parent() cat: Cat,
    @CurrentUser() currentUser,
    @Context() ctx,
  ): Promise<string[]> {
    const token = await this.memoryTokenService.getToken(currentUser._id);
    const baseUrl = this.filesService.getFileBaseEndpointUrl(ctx);
    return cat.filenames.map((filename) => {
      return `${baseUrl}/${token}/${filename}`;
    });
  }

  async updateCatFiles(id: string, filePromises: FileUpload[]) {
    try {
      const files = await Promise.all(filePromises);
      for (const file of files) {
        const fileHash = crypto.randomBytes(20).toString('hex');
        const filename = `${fileHash}-${file.filename}`;
        await this.catService.addFilename(id, filename);
        await this.filesService.createFile(file.createReadStream, filename);
      }
    } catch (e) {
      return e;
    }
  }
}
