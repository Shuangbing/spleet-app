"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

function setLocale(locale: string) {
  document.cookie = `locale=${locale}; path=/`;
  location.reload();
}

export function LangueageSelect({ locale }: { locale: string }) {
  return (
    <Select value={locale} onValueChange={(value: string) => setLocale(value)}>
      <SelectTrigger className="rounded-full">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
        <SelectItem value="zh">简体中文</SelectItem>
      </SelectContent>
    </Select>
  );
}
