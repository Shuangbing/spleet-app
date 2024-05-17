"use client";
const RECENT_BILLS = "RECENT_BILLS";

export type RecentBill = {
  id: string,
  name: string
}

export function updateRecentBills({ id, name }: RecentBill) {
  const recentBills = JSON.parse(
    localStorage.getItem(RECENT_BILLS) || "[]"
  ) as RecentBill[];
  if (recentBills.find((bill) => bill.id === id)) {
    const updatedBills = [
      { id, name },
      ...recentBills.filter((item) => item.id !== id),
    ];
    localStorage.setItem(RECENT_BILLS, JSON.stringify(updatedBills));
  } else {
    const updatedBills = [
      { id, name },
      ...recentBills,
    ];
    localStorage.setItem(RECENT_BILLS, JSON.stringify(updatedBills));
  }
}

export function getRecentBills() {
  return JSON.parse(
    localStorage.getItem("RECENT_BILLS") || "[]"
  ) as RecentBill[];
}
