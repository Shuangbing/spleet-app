import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Avatar } from "./avatar";
import { Participant, Transaction } from "@/lib/redis";
import { cn, postData, deleteRequest } from "@/lib/utils";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Button } from "./button";
import { useTranslations } from "next-intl";
import { useOverlay } from "@/app/context/OverlayContext";

interface transactionEditorProps {
  editorType: "new" | "edit";
  billId: string;
  transaction: Transaction | null;
  participants: Participant[];
  handleBackButtonClick: () => void;
  handleAddTransactionButtonClick: () => void;
}

const TransactionEditor: React.FC<transactionEditorProps> = ({
  editorType,
  transaction,
  billId,
  participants,
  handleBackButtonClick,
  handleAddTransactionButtonClick,
}) => {
  const t = useTranslations("BillPage");
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>(
    []
  );
  const { showOverlay } = useOverlay();

  const handleCheckboxChange = (id: string) => {
    setSelectedBeneficiaries((prevValues) => {
      if (prevValues.includes(id)) {
        return prevValues.filter((v) => v !== id);
      } else {
        return [...prevValues, id];
      }
    });
  };

  const addTransaction = async () => {
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
      const endpoint =
        editorType === "new"
          ? `/api/bill/${billId}`
          : `/api/bill/${billId}/transaction/${transaction?.id}`;
      await postData(endpoint, data);
      setPayer("");
      setSelectedBeneficiaries([]);
      setAmount(0);
      setDescription("");
      handleAddTransactionButtonClick();
    } catch (e) {
      showOverlay(`Failed! ${e}`);
    }
  };

  const removeTransaction = async () => {
    try {
      await deleteRequest(`/api/bill/${billId}/transaction/${transaction?.id}`);
      handleAddTransactionButtonClick();
    } catch (e) {
      showOverlay(`Failed! ${e}`);
    }
  };

  useEffect(() => {
    if (editorType === "edit" && transaction) {
      setPayer(transaction.payer_id);
      setSelectedBeneficiaries(transaction.beneficiary_ids);
      setAmount(transaction.amount);
      setDescription(transaction.description);
    }
  }, [editorType, transaction]);

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>
          {editorType === "new"
            ? t("addTransactionTitle")
            : t("editTransactionTitle")}
        </CardTitle>
        <CardDescription>{t("addTransactionDescription")}</CardDescription>
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
              {participants.map((participant) => (
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
            {participants.map((participant, index) => (
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
                      <div className="select-none">{participant.name}</div>
                    </div>

                    <Checkbox
                      className="rounded-md border border-gray-300 bg-white text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-primary-400 dark:focus:ring-primary-500"
                      id={`checkbox_${participant.id}`}
                      value={participant.id}
                      onCheckedChange={() =>
                        handleCheckboxChange(participant.id)
                      }
                      checked={selectedBeneficiaries.includes(participant.id)}
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
        <Button className="w-full h-12" onClick={() => addTransaction()}>
          {editorType === "new"
            ? t("addTransactionButton")
            : t("editTransactionButton")}
        </Button>
        <Button
          className="w-full h-12"
          variant="outline"
          onClick={handleBackButtonClick}
        >
          {t("backToTransactionsButton")}
        </Button>
        {editorType === "edit" ? (
          <>
            <div className="border-t border-gray-200 dark:border-gray-800 w-full my-11" />
            <Button
              className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 dark:text-white"
              onClick={() => removeTransaction()}
            >
              {t("deleteTransactionButton")}
            </Button>
          </>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default TransactionEditor;
