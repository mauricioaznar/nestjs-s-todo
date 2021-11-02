import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Todo, TodoInput } from './todo.dto';
import { User } from '../auth/auth.dto';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Todo)
export class TodoResolver {
  constructor(
    private readonly todoService: TodoService,
    private readonly authService: AuthService,
  ) {}

  @Query((returns) => [Todo])
  @UseGuards(GqlAuthGuard)
  async todos(@CurrentUser() currentUser: User) {
    const user = await this.authService.findOneByUsername({
      username: currentUser.username,
    });
    return this.todoService.findAll({
      user,
    });
  }

  @Mutation((returns) => Todo)
  @UseGuards(GqlAuthGuard)
  async createTodo(
    @Args('todoInput') input: TodoInput,
    @CurrentUser() currentUser: User,
  ) {
    const user = await this.authService.findOneByUsername({
      username: currentUser.username,
    });
    const todo = await this.todoService.create(input, user);
    await pubSub.publish('todo', { todo: todo });
    return todo;
  }

  @Mutation((returns) => Todo)
  @UseGuards(GqlAuthGuard)
  async updateTodo(
    @Args('_id') id: string,
    @Args('todoInput') input: TodoInput,
  ) {
    const todo = await this.todoService.update(id, input);
    await pubSub.publish('todo', { todo: todo });
    return todo;
  }

  @Mutation((returns) => Todo)
  @UseGuards(GqlAuthGuard)
  async deleteTodo(@Args('_id') id: string) {
    const todo = await this.todoService.delete(id);
    await pubSub.publish('todo', { todo: todo });
    return todo;
  }

  @ResolveField('user', () => User)
  async user(@Parent() todo: Todo): Promise<User> {
    const user = todo.user;
    return this.authService.findOneByUser({ user: user });
  }

  @Subscription((returns) => Todo, {
    async filter(this: TodoResolver, value, variables, args) {
      const user = await this.authService.findOneByToken(args);
      const { todo } = value;
      return user._id.equals(todo.user);
    },
  })
  async todo() {
    return pubSub.asyncIterator('todo');
  }
}
