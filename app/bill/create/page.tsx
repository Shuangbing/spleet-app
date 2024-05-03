"use client";

import { PlusIcon } from "@/components/icons/PlusIcon";
import { XIcon } from "@/components/icons/XIcon";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBaseUrl, getColorByIndex } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STEP = {
  INPUT_NEW_BILL: "INPUT_NEW_BILL",
  COMFIRM_NEW_BILL: "COMFIRM_NEW_BILL",
};

export default function CreateBill() {
  const [step, setStep] = useState(STEP.INPUT_NEW_BILL);
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [billName, setBillName] = useState("");
  const router = useRouter();

  function addParticipant(name: string) {
    if (name.length === 0) {
      return;
    }
    setParticipants([...participants, name]);
    setNewParticipantName("");
  }

  function removeParticipant(indexToRemove: number) {
    setParticipants(participants.filter((_, index) => index !== indexToRemove));
  }

  function confirmNewBillForm() {
    if (billName.length === 0) {
      return;
    }
    if (participants.length === 0) {
      return;
    }
    setStep(STEP.COMFIRM_NEW_BILL);
  }

  async function sendCreateBillRequest() {
    const data = { bill_name: billName, participants: participants };
    const response = await fetch(`${getBaseUrl()}/api/bill`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    try {
      const result = await response.json();
      const billId = result.data?.bill_id;
      if (billId) {
        router.push(`/bill/${billId}`);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-md">
        {step === STEP.INPUT_NEW_BILL ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>New bill</CardTitle>
              <CardDescription>
                Create a new bill and add participants to split the cost.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bill Name</Label>
                <Input
                  id="name"
                  value={billName}
                  onChange={(event) => setBillName(event.target.value)}
                  placeholder="Dinner at Acme Restaurant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participants">Participants</Label>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="participants"
                      value={newParticipantName}
                      onChange={(event) =>
                        setNewParticipantName(event.target.value)
                      }
                      placeholder="Add participant"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => addParticipant(newParticipantName)}
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span className="sr-only">Add participant</span>
                    </Button>
                  </div>

                  {participants.map((participant, index) => {
                    return (
                      <div
                        className="flex items-center gap-2"
                        key={`participant_${index}`}
                      >
                        <Avatar
                          className="h-8 w-8 text-white"
                          style={{
                            backgroundColor: `${getColorByIndex(index)}`,
                          }}
                        >
                          {participant.slice(0, 1).toUpperCase()}
                        </Avatar>
                        <span className="font-medium">{participant}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => removeParticipant(index)}
                        >
                          <XIcon className="h-4 w-4" />
                          <span className="sr-only">Remove participant</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => confirmNewBillForm()}>
                Next
              </Button>
            </CardFooter>
          </Card>
        ) : null}
        {step === STEP.COMFIRM_NEW_BILL ? (
          <Card>
            <CardHeader>
              <CardTitle>{billName}</CardTitle>
              <CardDescription>
                {participants.length} participants split the bill.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {participants.map((participant, index) => (
                  <div
                    className="flex items-center justify-between"
                    key={`participant_list_${index}`}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        className="h-8 w-8 text-white"
                        style={{
                          backgroundColor: `${getColorByIndex(index)}`,
                        }}
                      >
                        {participant.slice(0, 1).toUpperCase()}
                      </Avatar>
                      <span className="font-medium">{participant}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => sendCreateBillRequest()}
              >
                Create a new bill
              </Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
