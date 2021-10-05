import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CatService } from './cat.service';
import { CatInputType, CatType } from './cat.dto';

@Resolver()
export class CatResolver {
  constructor(private readonly catService: CatService) {}

  @Query((returns) => [CatType])
  async cats() {
    return this.catService.findAll();
  }

  @Mutation((returns) => CatType)
  async createCat(@Args('catInput') input: CatInputType) {
    return this.catService.create(input);
  }

  @Mutation((returns) => CatType)
  async updateCat(
    @Args('_id') id: string,
    @Args('catInput') input: CatInputType,
  ) {
    return this.catService.update(id, input);
  }

  @Mutation((returns) => CatType)
  async deleteCat(@Args('_id') id: string) {
    return this.catService.delete(id);
  }
}
