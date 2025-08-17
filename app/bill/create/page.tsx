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
import { postData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useOverlay } from "@/app/context/OverlayContext";
import RecentBills from "@/components/ui/recentBills";

const STEP = {
  INPUT_NEW_BILL: "INPUT_NEW_BILL",
  COMFIRM_NEW_BILL: "COMFIRM_NEW_BILL",
};

export default function CreateBill() {
  const t = useTranslations("CreateBill");
  const participantInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(STEP.INPUT_NEW_BILL);
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [billName, setBillName] = useState("");
  const router = useRouter();
  const { showOverlay } = useOverlay();

  function addParticipant(name: string) {
    if (name.length === 0) {
      showOverlay(t("participantNameRequired"));
      return;
    }
    setParticipants([...participants, name]);
    setNewParticipantName("");
    participantInputRef.current?.focus();
  }

  function removeParticipant(indexToRemove: number) {
    setParticipants(participants.filter((_, index) => index !== indexToRemove));
  }

  function confirmNewBillForm() {
    if (billName.length === 0) {
      showOverlay(t("groupNameRequired"));
      return;
    }
    if (participants.length === 0) {
      showOverlay(t("atLeastOneParticipant"));
      return;
    }
    setStep(STEP.COMFIRM_NEW_BILL);
  }

  async function sendCreateBillRequest() {
    const data = { bill_name: billName, participants: participants };
    try {
      const { bill_id: billId } = await postData<{ bill_id: string }>(
        "/api/bill",
        data
      );
      if (!billId) {
        showOverlay(t("creationFailed"));
      }
      router.push(`/bill/${billId}`);
    } catch (e) {
      showOverlay(t("creationError"));
    }
  }

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-auto max-w-md">
        {step === STEP.INPUT_NEW_BILL ? (
          <>
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                {t("newBillTitle")}
              </h1>
              <p className="text-muted-foreground">
                {t("newBillDescription")}
              </p>
            </div>
            
            <Card className="mb-6 animate-scale-in">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl">{t("newBillTitle")}</CardTitle>
                <CardDescription>{t("newBillDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("billNameLabel")}</Label>
                  <Input
                    id="name"
                    value={billName}
                    onChange={(event) => setBillName(event.target.value)}
                    placeholder={t("billNamePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">{t("participantsLabel")}</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 pb-2">
                      <Input
                        id="participants"
                        ref={participantInputRef}
                        value={newParticipantName}
                        onChange={(event) =>
                          setNewParticipantName(event.target.value)
                        }
                        placeholder={t("addParticipant")}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => addParticipant(newParticipantName)}
                        className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span className="sr-only">{t("addParticipant")}</span>
                      </Button>
                    </div>

                    {participants.map((participant, index) => {
                      return (
                        <div
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/70 transition-all duration-200 animate-slide-in-from-left"
                          key={`participant_${index}`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              className="h-10 w-10 text-white"
                              username={participant}
                            />
                            <span className="font-medium text-foreground">{participant}</span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeParticipant(index)}
                            className="hover:bg-destructive hover:text-destructive-foreground h-8 w-8"
                          >
                            <XIcon className="h-4 w-4" />
                            <span className="sr-only">
                              {t("removeParticipant")}
                            </span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="gradient" 
                  size="lg" 
                  className="w-full" 
                  onClick={() => confirmNewBillForm()}
                >
                  {t("nextButton")}
                </Button>
              </CardFooter>
            </Card>
            <RecentBills />
          </>
        ) : null}
        {step === STEP.COMFIRM_NEW_BILL ? (
          <div className="animate-scale-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                {t("billTitle", { billName })}
              </h1>
              <p className="text-muted-foreground">
                {t("billDescription", { participants: participants.length })}
              </p>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-xl">{billName}</CardTitle>
                <CardDescription className="text-center">
                  {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {participants.map((participant, index) => (
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 animate-slide-in-from-right"
                      key={`participant_list_${index}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Avatar
                        className="h-10 w-10 text-white"
                        username={participant}
                      />
                      <span className="font-medium text-foreground">{participant}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={() => sendCreateBillRequest()}
                >
                  {t("createNewBillButton")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}
