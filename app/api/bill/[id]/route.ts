
import { RedisClient } from "@/lib/redis";
import { createFailedNextResponse, createSuccessNextResponse, generateUuid } from "@/lib/utils";
import { Bill } from "../route";

const redisClient = new RedisClient();

export async function GET(_: Request,
  { params }: { params: { id: string } },) {
  const billId = params.id
  const result = await redisClient.getBill<Bill>(billId)

  if (!result) {
    return createFailedNextResponse({ message: 'not found bill' })
  }
  return createSuccessNextResponse<Bill>({ data: result })
}