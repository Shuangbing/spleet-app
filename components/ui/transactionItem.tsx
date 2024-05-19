import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "./card";
import { Avatar } from "./avatar";
import { RightArrow } from "../icons/RightArrow";
import { Participant, Transaction } from "@/lib/redis";
import { timestampToString } from "@/lib/utils";

interface TransactionItemProps {
  transaction: Transaction;
  participants: Participant[];
  onClick: () => void;
}

const getNameByUserId = (id: string, participants: Participant[]) => {
  return participants.find((value) => value.id === id)?.name || "?";
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  participants,
  onClick,
}) => {
  return (
    <Card onClick={onClick}>
      <CardContent className="grid gap-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              className="h-8 w-8"
              username={getNameByUserId(transaction.payer_id, participants)}
            ></Avatar>
            <div>
              <div className="font-medium">{transaction.description}</div>

              <div className="flex flex-wrap gap-y-0.5 space-x-0.5">
                <RightArrow className="h-5 w-5"></RightArrow>
                {transaction.beneficiary_ids.map((id) => (
                  <Avatar
                    key={`recent_transactions_avatar_${id}`}
                    className="h-5 w-5 text-xs"
                    username={getNameByUserId(id, participants)}
                  ></Avatar>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-end flex-col">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {timestampToString(transaction.timestamp)}
            </div>
            <div className="font-medium text-green-500">
              ￥{transaction.amount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionItem;
