import { OverlayProvider } from "../context/OverlayContext";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full flex-col">
      <OverlayProvider>{children}</OverlayProvider>
    </div>
  );
}
