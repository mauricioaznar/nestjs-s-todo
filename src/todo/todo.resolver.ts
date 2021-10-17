import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {TodoService} from './todo.service';
import {GqlAuthGuard} from "../auth/guards/gql-auth.guard";
import {UseGuards} from "@nestjs/common";
import {Todo, TodoInput} from "./todo.dto";

@Resolver()
export class TodoResolver {
    constructor(private readonly todoService: TodoService) {
    }


    @Query((returns) => [Todo])
    @UseGuards(GqlAuthGuard)
    async todos() {
        return this.todoService.findAll();
    }

    @Mutation((returns) => Todo)
    async createTodo(@Args('todoInput') input: TodoInput) {
        return this.todoService.create(input);
    }

    @Mutation((returns) => Todo)
    async updateTodo(
        @Args('_id') id: string,
        @Args('todoInput') input: TodoInput,
    ) {
        return this.todoService.update(id, input);
    }

    @Mutation((returns) => Todo)
    async deleteTodo(@Args('_id') id: string) {
        return this.todoService.delete(id);
    }
}
