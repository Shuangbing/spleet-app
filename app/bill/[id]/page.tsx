"use client";
import { useTranslations } from "next-intl";
import { Bill, Transaction } from "@/lib/redis";
import { Button } from "@/components/ui/button";
import { fetchData, generatePaymentSuggestions } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useSWRConfig } from "swr";
import { updateRecentBills } from "@/lib/clientUtils";
import PaymentSuggestionList from "@/components/ui/paymentSuggestionList";
import TransactionItem from "@/components/ui/transactionItem";
import TransactionEditor from "@/components/ui/transactionEditor";
import BillHeader from "@/components/ui/billHeader";

export default function BillPage({ params }: { params: { id: string } }) {
  const billId = params.id;
  const t = useTranslations("BillPage");
  const { data } = useSWR<Bill>(`/api/bill/${params.id}`, fetchData);
  const [isOpenTransactionEditor, setOpenTransactionEditor] = useState(false);
  const { mutate } = useSWRConfig();
  const [editorType, setEditorType] = useState<"new" | "edit">("new");
  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);

  const handleAddTransactionButtonClick = () => {
    setOpenTransactionEditor(false);
    mutate(`/api/bill/${billId}`);
  };

  const handleTransactionItemClick = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setEditorType("edit");
    setOpenTransactionEditor(true);
  };

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

  useEffect(() => {
    if (!data) {
      return;
    }
    updateRecentBills({ id: billId, name: data.bill_name });
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-md">
        <BillHeader
          billName={data.bill_name}
          participants={data.participants}
        />
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
                    <TransactionItem
                      onClick={() => handleTransactionItemClick(transaction)}
                      key={`transaction_${transaction.id}`}
                      transaction={transaction}
                      participants={data.participants}
                    />
                  ))}
              </div>

              {paymentSuggestions.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {t("paymentSuggestionsTitle")}
                    </h2>
                  </div>
                  <PaymentSuggestionList suggestions={paymentSuggestions} />
                </>
              ) : null}
            </div>
          </>
        ) : null}

        {isOpenTransactionEditor ? (
          <TransactionEditor
            editorType={editorType}
            billId={billId}
            participants={data.participants}
            transaction={currentTransaction}
            handleAddTransactionButtonClick={handleAddTransactionButtonClick}
            handleBackButtonClick={() => setOpenTransactionEditor(false)}
          />
        ) : null}
      </div>
    </main>
  );
}
