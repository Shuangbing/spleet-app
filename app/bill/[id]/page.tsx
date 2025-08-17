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
    <main className="flex-1 overflow-auto p-4 sm:p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-auto max-w-md animate-fade-in">
        <BillHeader
          billName={data.bill_name}
          participants={data.participants}
        />
        {!isOpenTransactionEditor ? (
          <>
            <Button
              className="w-full mb-6"
              variant="gradient"
              size="lg"
              onClick={() => {
                setEditorType("new");
                setCurrentTransaction(null);
                setOpenTransactionEditor(true);
              }}
            >
              {t("addTransactionTitle")}
            </Button>

            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {t("recentTransactionsTitle")}
                </h2>
              </div>
              <div className="grid gap-3">
                {data.transactions
                  .slice()
                  .reverse()
                  .map((transaction, index) => (
                    <div 
                      key={`transaction_${transaction.id}`}
                      className="animate-slide-in-from-right"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <TransactionItem
                        onClick={() => handleTransactionItemClick(transaction)}
                        transaction={transaction}
                        participants={data.participants}
                      />
                    </div>
                  ))}
              </div>

              {paymentSuggestions.length > 0 ? (
                <div className="animate-slide-in-from-bottom">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {t("paymentSuggestionsTitle")}
                    </h2>
                  </div>
                  <PaymentSuggestionList suggestions={paymentSuggestions} />
                </div>
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
