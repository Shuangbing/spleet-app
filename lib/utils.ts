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
