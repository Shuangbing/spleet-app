import { CalculatorIcon } from "@/components/icons/CalculatorIcon";
import { UsersIcon } from "@/components/icons/UsersIcon";
import { WalletIcon } from "@/components/icons/WalletIcon";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="relative py-20 md:py-32 lg:py-40">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
              {t("spleetTitle")}
            </h1>
            <h2 className="mt-4 text-xl font-semibold text-muted-foreground sm:text-2xl md:text-3xl animate-slide-in-from-bottom animation-delay-300">
              {t("spleetSubtitle")}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed max-w-2xl mx-auto animate-slide-in-from-bottom animation-delay-500">
              {t("spleetDescription")}
            </p>
            <div className="mt-10 animate-slide-in-from-bottom animation-delay-700">
              <Link href="/bill/create">
                <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 relative overflow-hidden group">
                  <span className="relative z-10">{t("getStartedButton")}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-purple-500/80 to-pink-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                Why Choose Spleet?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the future of bill splitting with our intelligent and beautiful platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-card rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/50">
                  <div className="relative">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <CalculatorIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-4">
                      {t("transparentSplittingTitle")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("transparentSplittingDescription")}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-card rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/50">
                  <div className="relative">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <WalletIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-4">
                      {t("instantCalculationTitle")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("instantCalculationDescription")}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group relative md:col-span-2 lg:col-span-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-primary rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-card rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/50">
                  <div className="relative">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-pink-600 to-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <UsersIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-4">
                      {t("easyOperationTitle")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("easyOperationDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="relative py-12 border-t border-border/40">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <WalletIcon className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Spleet!
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{t("copyright")}</p>
            <nav className="flex gap-6">
              <Link
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                href="#"
              >
                {t("privacyPolicyLink")}
              </Link>
              <Link
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
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
