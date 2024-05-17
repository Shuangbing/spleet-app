import { getLocale } from "next-intl/server";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return <div className="flex w-full flex-col">{children}</div>;
}
