import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as crypto from 'crypto';
import { NextResponse } from "next/server";
import { promise } from "zod";

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

export async function fetchData(path: string) {
  const res = await fetch(`${getBaseUrl()}${path}`);
  const { data } = await res.json();
  return data;
};

export async function postData<T>(path: string, { arg }: { arg: T }) {
  await fetch(`${getBaseUrl()}${path}`, {
    method: "POST",
    body: JSON.stringify({ ...arg }),
  });
};
