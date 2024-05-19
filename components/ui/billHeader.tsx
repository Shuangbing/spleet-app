import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Avatar } from "./avatar";
import { Participant, Transaction } from "@/lib/redis";

interface BillHeaderProps {
  billName: string;
  participants: Participant[];
}

const BillHeader: React.FC<BillHeaderProps> = ({ billName, participants }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="mb-2">{billName}</CardTitle>
        <CardDescription className="flex flex-wrap gap-1">
          {participants.map((participant) => (
            <Avatar
              className="h-8 w-8 text-white"
              key={`header_avatar_${participant.id}`}
              username={participant.name}
            />
          ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default BillHeader;
