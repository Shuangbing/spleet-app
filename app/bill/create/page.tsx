"use client";

import { PlusIcon } from "@/components/icons/PlusIcon";
import { XIcon } from "@/components/icons/XIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useState } from "react";

type Participant = {
  name: string;
};

const STEP = {
  INPUT_NEW_BILL: "INPUT_NEW_BILL",
  COMFIRM_NEW_BILL: "COMFIRM_NEW_BILL",
};

export default function CreateBill() {
  const [step, setStep] = useState(STEP.INPUT_NEW_BILL);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [billName, setBillName] = useState("");

  function addParticipant(name: string) {
    if (name.length === 0) {
      return;
    }
    setParticipants([...participants, { name }]);
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
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border">
                          <AvatarImage
                            alt="@username"
                            src="/placeholder-user.jpg"
                          />
                          <AvatarFallback>
                            {participant.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{participant.name}</span>
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
                {participants.map((participant) => (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage
                          alt="@username"
                          src="/placeholder-user.jpg"
                        />
                        <AvatarFallback>
                          {participant.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{participant.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Create Bill
              </Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
