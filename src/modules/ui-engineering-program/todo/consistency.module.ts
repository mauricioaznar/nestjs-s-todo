import { Module } from '@nestjs/common';
import { ConsistencyService } from './consistency.service';
import { ConsistencyResolver } from './consistency.resolver';

@Module({
  imports: [],
  providers: [ConsistencyService, ConsistencyResolver],
})
export class ConsistencyModule {}
