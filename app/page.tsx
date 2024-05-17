import { CalculatorIcon } from "@/components/icons/CalculatorIcon";
import { UsersIcon } from "@/components/icons/UsersIcon";
import { WalletIcon } from "@/components/icons/WalletIcon";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 64px)" }}>
      <header className="w-full bg-gray-900 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {t("spleetTitle")}
            </h1>
            <h2 className="mt-2 text-xl font-bold text-white sm:text-xl md:text-2xl">
              {t("spleetSubtitle")}
            </h2>
            <p className="mt-4 text-lg text-gray-400 md:text-xl">
              {t("spleetDescription")}
            </p>
            <div className="mt-8">
              <Link
                className="inline-flex items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                href="/bill/create"
              >
                {t("getStartedButton")}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <CalculatorIcon className="mx-auto h-12 w-12 text-blue-500" />
                  <h3 className="mt-4 text-xl font-semibold">
                    {t("transparentSplittingTitle")}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {t("transparentSplittingDescription")}
                  </p>
                </div>
                <div>
                  <WalletIcon className="mx-auto h-12 w-12 text-blue-500" />
                  <h3 className="mt-4 text-xl font-semibold">
                    {t("instantCalculationTitle")}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {t("instantCalculationDescription")}
                  </p>
                </div>
                <div>
                  <UsersIcon className="mx-auto h-12 w-12 text-blue-500" />
                  <h3 className="mt-4 text-xl font-semibold">
                    {t("easyOperationTitle")}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {t("easyOperationDescription")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">{t("copyright")}</p>
            <nav className="flex gap-4">
              <Link
                className="text-sm text-gray-400 hover:text-gray-300"
                href="#"
              >
                {t("privacyPolicyLink")}
              </Link>
              <Link
                className="text-sm text-gray-400 hover:text-gray-300"
                href="#"
              >
                {t("contactUsLink")}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
