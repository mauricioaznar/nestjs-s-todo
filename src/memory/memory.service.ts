import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

export type UserSchema = any;

@Injectable()
export class MemoryService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  test() {
    return 'asdfasdfasdfasdfasdf';
  }
}
