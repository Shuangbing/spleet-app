import { Redis } from '@upstash/redis';

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
  constructor(private redis = new Redis({
    url: process.env.REDIS_KV_REST_API_URL,
    token: process.env.REDIS_KV_REST_API_TOKEN,
  })) { }

  public async setBill<T>(key: string, value: T): Promise<void> {
    await this.redis.json.set(key, '$', JSON.stringify(value))
  }

  public async getBill<T>(key: string): Promise<T | null> {
    const result = await this.redis.json.get(key)
    if (!result) {
      return null;
    }
    return result as T;
  }

  public async addTransaction(key: string, value: Transaction) {
    return await this.redis.json.arrappend(key, '$.transactions', JSON.stringify(value))
  }

  public async editTransaction(key: string, value: Transaction[]) {
    return await this.redis.json.set(key, '$.transactions', JSON.stringify(value))
  }
}