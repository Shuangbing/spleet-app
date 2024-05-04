
import { RedisClient } from "@/lib/redis";
import { createFailedNextResponse, createSuccessNextResponse, generateUuid } from "@/lib/utils";
import { Bill } from "@/lib/redis";
import { NextApiResponse } from "next";
import { z } from "zod";

const redisClient = new RedisClient();

export async function GET(_: Request,
  { params }: { params: { id: string } }) {
  const billId = params.id
  const result = await redisClient.getBill<Bill>(billId)

  if (!result) {
    return createFailedNextResponse({ message: 'not found bill' })
  }
  return createSuccessNextResponse<Bill>({ data: result })
}

export async function POST(req: Request,
  { params }: { params: { id: string } }) {


  const billId = params.id
  const currentBill = await redisClient.getBill<Bill>(billId)


  if (!currentBill) {
    return createFailedNextResponse({ message: 'bill not found' })
  }

  const currentParticipants = currentBill?.participants.map((participant) => participant.id)

  const schema = z.object({
    payer: z.string({ message: 'payer is required' }).refine((val) => currentParticipants.includes(val), {
      message: "payer not found",
    }),
    beneficiaries: z.string({ message: 'beneficiaries is required' }).refine((val) => currentParticipants.includes(val), {
      message: "beneficiarie not found",
    }).array().nonempty({ message: 'beneficiaries must contain at least 1 people' }),
    amount: z.number({ message: 'amount is required' }).min(0),
    description: z.string({ message: 'description is required' }).max(100, { message: 'description max 100 chars' })
  });


  const response = schema.safeParse(await req.json());

  if (!response.success) {
    const { errors } = response.error;
    const combinedMessages = errors.map(error => error.message).join(', ');
    return createFailedNextResponse({ message: combinedMessages })
  }

  const { payer, beneficiaries, amount, description } = response.data;

  const value = {
    id: generateUuid(),
    payer_id: payer,
    beneficiary_ids: [...beneficiaries],
    amount,
    description,
    timestamp: Date.now(),
  }

  await redisClient.addTransaction(billId, value)

  return createSuccessNextResponse({ data: null })
}
