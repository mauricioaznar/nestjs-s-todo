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
import TodoResponse, { Todo, TodoInput, TodoQueryArgs } from './todo.dto';
import { User } from '../auth/auth.dto';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PubSub } from 'graphql-subscriptions';
import { ForbiddenError } from 'apollo-server-express';
import ConnectionArgs from '../common/connection-args';
import { connectionFromArraySlice } from 'graphql-relay';

const pubSub = new PubSub();

@Resolver(() => Todo)
export class TodoResolver {
  constructor(
    private readonly todoService: TodoService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => TodoResponse)
  @UseGuards(GqlAuthGuard)
  async todos(
    @CurrentUser() currentUser: User,
    @Args() connectionArgs: ConnectionArgs,
    @Args() todoQueryArgs?: TodoQueryArgs,
  ): Promise<TodoResponse> {
    const { limit, offset } = connectionArgs.pagingParams();

    const result = await this.todoService.findAll({
      todoQueryArgs: todoQueryArgs,
      user: currentUser,
      limit,
      offset,
    });

    const page = connectionFromArraySlice(result, connectionArgs, {
      arrayLength: result.length,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count: result.length, limit, offset } };
  }

  @Mutation(() => Todo)
  @UseGuards(GqlAuthGuard)
  async createTodo(
    @Args('todoInput') input: TodoInput,
    @CurrentUser() currentUser: User,
  ) {
    const todo = await this.todoService.create(input, currentUser);
    await pubSub.publish('todo', { todo: todo });
    return todo;
  }

  @Mutation(() => Todo)
  @UseGuards(GqlAuthGuard)
  async updateTodo(
    @Args('_id') id: string,
    @Args('todoInput') input: TodoInput,
    @CurrentUser() currentUser: User,
  ) {
    const oldTodo = await this.todoService.findOne({ _id: id });
    if (oldTodo.user.toString() !== currentUser._id) {
      return new ForbiddenError('Your user is not allowed to delete this post');
    }
    const todo = await this.todoService.update(id, input);
    await pubSub.publish('todo', { todo: todo });
    return todo;
  }

  @Mutation(() => Todo)
  @UseGuards(GqlAuthGuard)
  async deleteTodo(@Args('_id') id: string, @CurrentUser() currentUser: User) {
    const oldTodo = await this.todoService.findOne({ _id: id });
    if (oldTodo.user.toString() !== currentUser._id) {
      return new ForbiddenError('Your user is not allowed to delete this post');
    }
    if (oldTodo.locked === true) {
      return new ForbiddenError(
        'Todo is locked. Unlock it first before deletion.',
      );
    }
    const todo = await this.todoService.delete(id);
    await pubSub.publish('todo', { todo: todo });
    return todo;
  }

  @ResolveField('user', () => User)
  async user(@Parent() todo: Todo): Promise<User> {
    const user = todo.user;
    return this.authService.findOneByUser({ user: user });
  }

  @Subscription(() => Todo, {
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
