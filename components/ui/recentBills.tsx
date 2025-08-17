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

  return recentBills.length > 0 ? (
    <div className="grid gap-6 mt-8 animate-slide-in-from-bottom">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {t("recentBills")}
        </h2>
      </div>
      <div className="grid gap-3">
        {recentBills.map((bill, index) => {
          return (
            <Card 
              key={`RecentBill-${bill.id}`} 
              className="group hover:shadow-lg transition-all duration-300 animate-slide-in-from-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors duration-300">
                      {bill.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recent activity
                    </p>
                  </div>
                  <Link href={`/bill/${bill.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      {t("open")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default RecentBills;
