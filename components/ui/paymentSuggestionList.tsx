import { useTranslations } from "next-intl";
import React from "react";
import { Card, CardDescription, CardHeader } from "./card";
import { Avatar } from "./avatar";
import { RightArrow } from "../icons/RightArrow";
import { PaymentSuggestion } from "@/lib/utils";

interface PaymentSuggestionListProps {
  suggestions: PaymentSuggestion[];
}

const PaymentSuggestionList: React.FC<PaymentSuggestionListProps> = ({
  suggestions,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="p-4">
        <CardDescription className="grid gap-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={`sugestion_${index}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="flex gap-1 items-center font-bold dark:text-white">
                  <Avatar
                    className="h-8 w-8 text-white"
                    key={`header_avatar_${suggestion.from}`}
                    username={suggestion.from}
                  />
                  {suggestion.from}
                </div>
                <RightArrow />
                <div className="flex gap-1 items-center font-bold dark:text-white">
                  <Avatar
                    className="h-8 w-8 text-white"
                    key={`header_avatar_${suggestion.to}`}
                    username={suggestion.to}
                  />
                  {suggestion.to}
                </div>
              </div>
              <div className="flex items-end flex-col">
                <div className="font-medium text-green-500">
                  ￥{Math.ceil(suggestion.amount)}
                </div>
              </div>
            </div>
          ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default PaymentSuggestionList;
