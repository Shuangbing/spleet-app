
import { Bill } from '@/app/api/bill/route';
import Redis from 'ioredis';

export class RedisClient {
  constructor(private redis = new Redis(process.env.REDIS_URL || '')) { }

  public async setBill<T>(key: string, value: T): Promise<void> {
    await this.redis.call('JSON.SET', key, '$', JSON.stringify(value))
  }

  public async getBill<T>(key: string): Promise<T | null> {
    const result = await this.redis.call('JSON.GET', key, '$')
    if (!result || typeof result !== 'string') {
      return null;
    }
    return JSON.parse(result)[0] as T;
  }
}