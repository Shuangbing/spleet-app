"use client";
import { useTranslations } from "next-intl";
import { Bill } from "@/lib/redis";
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

import {
  cn,
  fetchData,
  generatePaymentSuggestions,
  postData,
  timestampToString,
} from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { RightArrow } from "../../../components/icons/RightArrow";
import { useSWRConfig } from "swr";
import { useOverlay } from "@/app/context/OverlayContext";

export default function BillPage({ params }: { params: { id: string } }) {
  const t = useTranslations("BillPage");
  const { data } = useSWR<Bill>(`/api/bill/${params.id}`, fetchData);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>(
    []
  );
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [isOpenTransactionEditor, setOpenTransactionEditor] = useState(false);
  const { mutate } = useSWRConfig();
  const { showOverlay } = useOverlay();

  function handleCheckboxChange(id: string) {
    setSelectedBeneficiaries((prevValues) => {
      if (prevValues.includes(id)) {
        return prevValues.filter((v) => v !== id);
      } else {
        return [...prevValues, id];
      }
    });
  }

  async function handleAddTransaction() {
    if (!payer) {
      showOverlay(t("payerInfoRequired"));
      return;
    }

    if (selectedBeneficiaries.length === 0) {
      showOverlay(t("beneficiariesRequired"));
      return;
    }

    if (amount === 0) {
      showOverlay(t("amountRequired"));
      return;
    }

    if (description.length === 0) {
      showOverlay(t("descriptionRequired"));
      return;
    }

    const data = {
      payer,
      beneficiaries: selectedBeneficiaries,
      amount,
      description,
    };
    try {
      await postData(`/api/bill/${params.id}`, data);
      setPayer("");
      setSelectedBeneficiaries([]);
      setAmount(0);
      setDescription("");
      setOpenTransactionEditor(false);
      mutate(`/api/bill/${params.id}`);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (data && data.transactions.length === 0) {
      setOpenTransactionEditor(true);
    }
  }, [data]);

  const paymentSuggestions = useMemo(
    () =>
      generatePaymentSuggestions(
        data?.participants || [],
        data?.transactions || []
      ),
    [data?.participants, data?.transactions]
  );

  if (!data) {
    return null;
  }

  function getNameByUserId(id: string) {
    return data?.participants.find((value) => value.id === id)?.name || "?";
  }

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-md">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="mb-2">{data.bill_name}</CardTitle>
            <CardDescription className="flex flex-wrap gap-1">
              {data.participants.map((participant) => (
                <Avatar
                  className="h-8 w-8 text-white"
                  key={`header_avatar_${participant.id}`}
                  username={participant.name}
                />
              ))}
            </CardDescription>
          </CardHeader>
        </Card>

        {!isOpenTransactionEditor ? (
          <>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setOpenTransactionEditor(true)}
            >
              {t("addTransactionTitle")}
            </Button>

            <div className="grid gap-4 mt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {t("recentTransactionsTitle")}
                </h2>
              </div>
              <div className="grid gap-2">
                {data.transactions
                  .slice()
                  .reverse()
                  .map((transaction) => (
                    <Card key={`transaction_${transaction.id}`}>
                      <CardContent className="grid gap-2 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar
                              className="h-8 w-8"
                              username={getNameByUserId(transaction.payer_id)}
                            ></Avatar>
                            <div>
                              <div className="font-medium">
                                {transaction.description}
                              </div>

                              <div className="flex flex-wrap gap-y-0.5 space-x-0.5">
                                <RightArrow className="h-5 w-5"></RightArrow>
                                {transaction.beneficiary_ids.map((id) => (
                                  <Avatar
                                    key={`recent_transactions_avatar_${id}`}
                                    className="h-5 w-5 text-xs"
                                    username={getNameByUserId(id)}
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
                  ))}
              </div>

              {paymentSuggestions.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {t("paymentSuggestionsTitle")}
                    </h2>
                  </div>
                  <Card className="mb-6">
                    <CardHeader className="p-4">
                      <CardDescription className="grid gap-2">
                        {paymentSuggestions.map((suggestion, index) => (
                          <div
                            key={`sugestion_${index}`}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div className="flex gap-1 items-center font-bold">
                                <Avatar
                                  className="h-8 w-8 text-white"
                                  key={`header_avatar_${suggestion.from}`}
                                  username={suggestion.from}
                                />
                                {suggestion.from}
                              </div>
                              <RightArrow />
                              <div className="flex gap-1 items-center font-bold">
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
                </>
              ) : null}
            </div>
          </>
        ) : null}

        {isOpenTransactionEditor ? (
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>{t("addTransactionTitle")}</CardTitle>
              <CardDescription>
                {t("addTransactionDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>{t("payerLabel")}</Label>
                <Select
                  value={payer}
                  onValueChange={(value: string) => setPayer(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectPayerPlaceholder")} />
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
                <Label>{t("beneficiariesLabel")}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.participants.map((participant, index) => (
                    <Card
                      key={`card_${participant.id}`}
                      className={cn({
                        ["bg-gray-100 dark:bg-gray-700"]:
                          selectedBeneficiaries.includes(participant.id),
                      })}
                    >
                      <label htmlFor={`checkbox_${participant.id}`}>
                        <CardContent className="flex justify-between items-center gap-2 h-12 p-4">
                          <div className="flex items-center gap-2">
                            <Avatar
                              className="h-8 w-8 text-white"
                              key={participant.id}
                              username={participant.name}
                            />
                            <div className="select-none">
                              {participant.name}
                            </div>
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
                <Label>{t("amountLabel")}</Label>
                <Input
                  placeholder={t("enterAmountPlaceholder")}
                  type="number"
                  value={amount ? String(amount) : ""}
                  onChange={(event) => setAmount(Number(event.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t("descriptionLabel")}</Label>
                <Input
                  placeholder={t("enterDescriptionPlaceholder")}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" onClick={() => handleAddTransaction()}>
                {t("addTransactionButton")}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setOpenTransactionEditor(false)}
              >
                {t("backToTransactionsButton")}
              </Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
