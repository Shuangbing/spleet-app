"use client";
import Link from "next/link";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { RecentBill, getRecentBills } from "@/lib/clientUtils";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const RecentBills: React.FC = () => {
  const t = useTranslations("CreateBill");
  const [recentBills, setRecentBills] = useState<RecentBill[]>([]);

  useEffect(() => {
    setRecentBills(getRecentBills());
  }, []);

  return (
    <div className="grid gap-4 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("recentBills")}</h2>
      </div>
      <div className="grid">
        {recentBills.map((bill) => {
          return (
            <Card key={`RecentBill-${bill.id}`} className="mb-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-xl">{bill.name}</p>
                  <Link href={`/bill/${bill.id}`}>
                    <Button>{t("open")}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecentBills;
