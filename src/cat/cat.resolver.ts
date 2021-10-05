import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CatService } from './cat.service';
import { CatInput, Cat } from './cat.dto';

@Resolver()
export class CatResolver {
  constructor(private readonly catService: CatService) {}

  @Query((returns) => [Cat])
  async cats() {
    return this.catService.findAll();
  }

  @Mutation((returns) => Cat)
  async createCat(@Args('catInput') input: CatInput) {
    return this.catService.create(input);
  }

  @Mutation((returns) => Cat)
  async updateCat(
    @Args('_id') id: string,
    @Args('catInput') input: CatInput,
  ) {
    return this.catService.update(id, input);
  }

  @Mutation((returns) => Cat)
  async deleteCat(@Args('_id') id: string) {
    return this.catService.delete(id);
  }
}
