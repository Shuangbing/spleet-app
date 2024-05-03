
import { RedisClient } from "@/lib/redis";
import { createFailedNextResponse, createSuccessNextResponse, generateUuid } from "@/lib/utils";

import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const redisClient = new RedisClient();

interface Participant {
  id: string;
  name: string;
}

interface Transaction {
  id: string,
  name: string;
  amount: number;
  payer_id: string;
  beneficiary_ids: string[];
}

export interface Bill {
  bill_name: string;
  participants: Participant[]
  transactions: Transaction[]
}

export async function POST(req: Request,
  res: NextApiResponse) {

  const schema = z.object({
    bill_name: z.string({ message: 'bill name is required' }).min(1, { message: 'bill name length min 1 char' }).max(50, { message: 'bill name length max 5 chars' }),
    participants: z.string({ message: 'participants name is required' }).min(1).max(50).array().nonempty({ message: 'participants must contain at least 1 people' }).max(50),
  });

  const response = schema.safeParse(await req.json());

  if (!response.success) {
    const { errors } = response.error;
    const combinedMessages = errors.map(error => error.message).join(', ');
    return createFailedNextResponse({ message: combinedMessages })
  }

  const { bill_name: billName, participants } = response.data;

  const billId = generateUuid()
  const participantsWithId = participants.map((participant) => {
    return { name: participant, id: generateUuid() }
  })
  const value: Bill = { bill_name: billName, participants: participantsWithId, transactions: [] }
  redisClient.setBill<Bill>(billId, value)
  return createSuccessNextResponse({ data: { bill_id: billId } })
}
