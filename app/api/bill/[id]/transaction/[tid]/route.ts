
import { RedisClient } from "@/lib/redis";
import { createFailedNextResponse, createSuccessNextResponse, generateUuid } from "@/lib/utils";
import { Bill } from "@/lib/redis";
import { z } from "zod";

const redisClient = new RedisClient();

export async function POST(req: Request,
  { params }: { params: { id: string, tid: string } }) {


  const billId = params.id
  const transactionId = params.tid
  const currentBill = await redisClient.getBill<Bill>(billId)

  if (!currentBill) {
    return createFailedNextResponse({ message: 'bill not found' })
  }

  const currentTransaction = currentBill.transactions.find(transaction => transaction.id === transactionId)

  if (!currentTransaction) {
    return createFailedNextResponse({ message: 'transaction not found' })
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
    id: currentTransaction.id,
    payer_id: payer,
    beneficiary_ids: [...beneficiaries],
    amount,
    description,
    timestamp: Date.now(),
  }

  const updatedTransactions = currentBill.transactions.map(transaction =>
    transaction.id === currentTransaction.id
      ? { ...transaction, ...value }
      : transaction
  );

  await redisClient.editTransaction(billId, updatedTransactions)

  return createSuccessNextResponse({ data: null })
}


export async function DELETE(req: Request,
  { params }: { params: { id: string, tid: string } }) {


  const billId = params.id
  const transactionId = params.tid
  const currentBill = await redisClient.getBill<Bill>(billId)

  if (!currentBill) {
    return createFailedNextResponse({ message: 'bill not found' })
  }

  const currentTransaction = currentBill.transactions.find(transaction => transaction.id === transactionId)

  if (!currentTransaction) {
    return createFailedNextResponse({ message: 'transaction not found' })
  }


  const updatedTransactions = currentBill.transactions.filter(transaction => transaction.id !== currentTransaction.id)

  await redisClient.editTransaction(billId, updatedTransactions)

  return createSuccessNextResponse({ data: null })
}
