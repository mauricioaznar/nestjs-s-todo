import { Resolver } from '@nestjs/graphql';

// local
import { ConsistencyService } from './consistency.service';

@Resolver()
export class ConsistencyResolver {
  constructor(private readonly consistencyService: ConsistencyService) {}
}
