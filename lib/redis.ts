import Redis from 'ioredis';

export interface Participant {
  id: string;
  name: string;
}

export interface Transaction {
  id: string,
  description: string;
  amount: number;
  payer_id: string;
  beneficiary_ids: string[];
  timestamp: number;
}

export interface Bill {
  bill_name: string;
  participants: Participant[]
  transactions: Transaction[]
}

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
    return JSON.parse(result)?.[0] as T;
  }

  public async addTransaction(key: string, value: Transaction) {
    return await this.redis.call('JSON.ARRAPPEND', key, '$.transactions', JSON.stringify(value))
  }
}