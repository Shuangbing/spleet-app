import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as crypto from 'crypto';
import { NextResponse } from "next/server";
import { Participant, Transaction } from "./redis";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUuid() {
  return crypto.randomUUID().replaceAll('-', '')
}

export function createSuccessNextResponse<T>({ message, data }: { message?: string; data?: T }) {

  let result: { result: string; message?: string; data?: any } = { result: 'success' }
  if (message) {
    result['message'] = message;
  }
  if (data) {
    result['data'] = data;
  }
  return NextResponse.json(result)
}

export function createFailedNextResponse({ message }: { message?: string; }) {

  let result: { result: string; message?: string; } = { result: 'failed' }
  if (message) {
    result['message'] = message;
  }

  return NextResponse.json(result, { status: 400 })
}

export function getBaseUrl() {
  return process.env.BASE_URL || 'http://localhost:3000'
}

export function stringToHexColor(str: string) {
  function hslToHex(hsl: string) {
    const hslRegex = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/;
    const match = hsl.match(hslRegex);

    if (match) {
      const h = parseInt(match[1]);
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;

      const a = s * Math.min(l, 1 - l);
      const f = (n: number, k = (n + h / 30) % 12) =>
        l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

      const toHex = (x: number) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, '0');

      const r = toHex(f(0));
      const g = toHex(f(8));
      const b = toHex(f(4));

      return `#${r}${g}${b}`;
    }

    return "#000000";
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;


  const saturation = 50;
  const lightness = 50;

  const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const rgbColor = hslToHex(hslColor);

  return rgbColor;
}

export async function fetchData(url: string) {
  const res = await fetch(url);
  const { data } = await res.json();
  return data;
};

export async function postData<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const { data: resData }: { data: T } = await res.json();
  return resData;
};

export async function deleteRequest<T>(url: string) {
  return await fetch(url, {
    method: "DELETE",
  });
};

export function timestampToString(timestamp: number) {
  const userLocale = navigator.language;
  const formattedDate = new Intl.DateTimeFormat(userLocale, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(timestamp);

  return formattedDate;
}

export type PaymentSuggestion = {
  from: string;
  to: string;
  amount: number;
}

export function generatePaymentSuggestions(participants: Participant[], transactions: Transaction[]): PaymentSuggestion[] {
  const balances: { [key: string]: { name: string; paid: number; owed: number; balance: number; } } = {};
  participants.forEach(participant => {
    balances[participant.id] = {
      name: participant.name,
      paid: 0,
      owed: 0,
      balance: 0
    };
  });

  // 处理每笔交易
  transactions.forEach(transaction => {
    const payer = transaction.payer_id;
    const amount = transaction.amount;
    const beneficiaries: string[] = transaction.beneficiary_ids;
    const perPerson = amount / beneficiaries.length; // 平均分配

    // 记录付款人支付的金额
    balances[payer].paid += amount;

    // 记录每个受益者的份额
    beneficiaries.forEach(beneficiary => {
      balances[beneficiary].owed += perPerson;
    });
  });

  // 计算每个参与者的净余额
  for (const key in balances) {
    const balance = balances[key];
    balance.balance = balance.paid - balance.owed;
  }

  // 创建支付建议
  const payments = [];

  // 获取正和负的余额
  const positiveBalances = [];
  const negativeBalances = [];

  for (const key in balances) {
    const balance = balances[key];
    if (balance.balance > 0) {
      positiveBalances.push(balance);
    } else if (balance.balance < 0) {
      negativeBalances.push(balance);
    }
  }

  // 平衡正负余额
  while (negativeBalances.length > 0 && positiveBalances.length > 0) {
    const debtor = negativeBalances[0];
    const creditor = positiveBalances[0];
    const paymentAmount = Math.min(Math.abs(debtor.balance), creditor.balance);

    payments.push({
      from: debtor.name,
      to: creditor.name,
      amount: paymentAmount
    });

    // 更新净余额
    debtor.balance += paymentAmount;
    creditor.balance -= paymentAmount;

    // 如果净余额为零，则从数组中删除
    if (Math.abs(debtor.balance) < 1e-6) {
      negativeBalances.shift();
    }

    if (Math.abs(creditor.balance) < 1e-6) {
      positiveBalances.shift();
    }
  }
  return payments;
}
