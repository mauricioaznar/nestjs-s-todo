import { Module } from '@nestjs/common';
import { ConsistencyModule } from './todo/consistency.module';

@Module({
  imports: [ConsistencyModule],
})
export class UiEngineeringProgramModule {}
