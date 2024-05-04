"use client";

import { Bill } from "@/app/api/bill/route";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchData } from "@/lib/utils";
import { useState } from "react";
import useSWR from "swr";

export default function BillPage({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR<Bill>(
    `/api/bill/${params.id}`,
    fetchData
  );
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>(
    []
  );

  const [payer, setPayer] = useState("");

  const handleCheckboxChange = (id: string) => {
    setSelectedBeneficiaries((prevValues) => {
      if (prevValues.includes(id)) {
        return prevValues.filter((v) => v !== id);
      } else {
        return [...prevValues, id];
      }
    });
  };

  if (!data) {
    return null;
  }

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-md">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="mb-2">{data.bill_name}</CardTitle>
            <CardDescription className="flex flex-wrap gap-1">
              {data.participants.map((participant, index) => (
                <Avatar
                  className="h-8 w-8 text-white"
                  key={participant.id}
                  username={participant.name}
                />
              ))}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
            <CardDescription>Split expenses with your friends.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Payer</Label>
              <Select value={payer} onValueChange={(value) => setPayer(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payer" />
                </SelectTrigger>
                <SelectContent>
                  {data.participants.map((participant) => (
                    <SelectItem
                      key={`option_${participant.id}`}
                      value={participant.id}
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar
                          className="h-6 w-6 text-white"
                          key={participant.id}
                          username={participant.name}
                        />
                        {participant.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Beneficiaries</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.participants.map((participant, index) => (
                  <Card key={`card_${participant.id}`}>
                    <label htmlFor={`checkbox_${participant.id}`}>
                      <CardContent className="flex justify-between items-center gap-2 h-12 p-4">
                        <div className="flex items-center gap-2">
                          <Avatar
                            className="h-8 w-8 text-white"
                            key={participant.id}
                            username={participant.name}
                          />
                          <div className="select-none">{participant.name}</div>
                        </div>

                        <Checkbox
                          className="rounded-md border border-gray-300 bg-white text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-primary-400 dark:focus:ring-primary-500"
                          id={`checkbox_${participant.id}`}
                          value={participant.id}
                          onCheckedChange={() =>
                            handleCheckboxChange(participant.id)
                          }
                          checked={selectedBeneficiaries.includes(
                            participant.id
                          )}
                        />
                      </CardContent>
                    </label>
                  </Card>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input placeholder="Enter amount" type="number" />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea placeholder="Enter description" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add Transaction</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
