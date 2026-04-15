import * as React from "react";
import { ChevronLeft, Tv, Refrigerator, Snowflake, WashingMachine, CookingPot, AirVent, Microwave, Speaker, Sparkles, Flame, GlassWater, IceCreamCone } from "lucide-react";
import { CATEGORIES, getProductsByCategory, formatKES, type CategorySlug, type Product } from "../data/products";
import { SITE_CONFIG } from "../data/site-config";
import { initTikTok, trackSelectCategory, trackSelectProduct, trackSelectPlan, trackCrbAnswer, trackFunnelStep, trackApplicationSubmitted } from "../lib/tracking-ga4";
import { submitApplication } from "../lib/submit-application";
import { PersonalDetailsStep } from "./ApplicationForm";
import { ApplicationReview } from "./ApplicationReview";
import { ApplicationConfirmation } from "./ApplicationConfirmation";

const ICON_MAP: Record<string, React.ElementType> = {
  Tv, Refrigerator, Snowflake, WashingMachine, CookingPot, AirVent,
  Microwave, Speaker, Sparkles, Flame, GlassWater, IceCreamCone,
};

type FlowStep = "category" | "product" | "plan" | "crb" | "crb_disqualified" | "details" | "review" | "confirmed";

const TOTAL_STEPS = 6;

export function QuotaPayQuiz() {
  const [step, setStep] = React.useState<FlowStep>("category");
  const [selectedCategory, setSelectedCategory] = React.useState<CategorySlug | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedMonths, setSelectedMonths] = React.useState<3 | 4 | 5 | 6 | null>(null);
  const [crbStatus, setCrbStatus] = React.useState<"yes" | "no" | null>(null);
  const [personalDetails, setPersonalDetails] = React.useState<{ fullName: string; phone: string; idNumber: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize TikTok Pixel on mount
  React.useEffect(() => { initTikTok(); }, []);

  const stepNumber = (() => {
    switch (step) {
      case "category": return 1;
      case "product": return 2;
      case "plan": return 3;
      case "crb": return 4;
      case "details": return 5;
      case "review": return 6;
      default: return 0;
    }
  })();

  const progress = (stepNumber / TOTAL_STEPS) * 100;

  const handleBack = () => {
    switch (step) {
      case "category": break;
      case "product": setStep("category"); break;
      case "plan": setStep("product"); break;
      case "crb": setStep("plan"); break;
      case "details": setStep("crb"); break;
      case "review": setStep("details"); break;
    }
  };

  const handleRestart = () => {
    setStep("category");
    setSelectedCategory(null);
    setSelectedProduct(null);
    setSelectedMonths(null);
    setCrbStatus(null);
    setPersonalDetails(null);
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !selectedMonths || !crbStatus || !personalDetails) return;
    setIsSubmitting(true);

    await submitApplication({
      fullName: personalDetails.fullName,
      phone: personalDetails.phone,
      idNumber: personalDetails.idNumber,
      product: selectedProduct,
      planMonths: selectedMonths,
      crbStatus,
    });

    trackFunnelStep(6, "submitted");
    trackApplicationSubmitted({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price });
    setIsSubmitting(false);
    setStep("confirmed");
  };

  // ── Confirmation ──
  if (step === "confirmed" && personalDetails && selectedProduct) {
    return (
      <ApplicationConfirmation
        fullName={personalDetails.fullName}
        idNumber={personalDetails.idNumber}
        productName={selectedProduct.name}
        onRestart={handleRestart}
      />
    );
  }

  // ── Quiz Steps ──
  const categoryProducts = selectedCategory ? getProductsByCategory(selectedCategory) : [];
  const selectedCategoryData = CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-24 bg-white min-h-dvh">
      {/* Progress Bar */}
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-green-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mb-6 flex justify-between text-sm text-gray-500">
        <span>Step {stepNumber} of {TOTAL_STEPS}</span>
        <span>
          {TOTAL_STEPS - stepNumber === 0
            ? "Final step"
            : `${TOTAL_STEPS - stepNumber} step${TOTAL_STEPS - stepNumber > 1 ? "s" : ""} left`}
        </span>
      </div>

      {/* ── Step 1: Category ── */}
      {step === "category" && (
        <>
          <div className="mb-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Which appliance are you{" "}
              <span className="text-green-600">interested in?</span>
            </h1>
            <p className="mt-2 text-gray-600">Pick a category to see available products.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat, index) => {
              const IconComponent = ICON_MAP[cat.icon];
              const count = getProductsByCategory(cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    trackSelectCategory(cat.name);
                    trackFunnelStep(1, "category");
                    setStep("product");
                  }}
                  className="flex flex-col items-center gap-2 rounded-xl border-2 border-gray-200 bg-white p-3 text-center transition-all hover:border-green-400 hover:shadow-md active:scale-95 animate-in fade-in zoom-in-95 duration-500 fill-mode-both overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {cat.image ? (
                    <div className="w-full h-16 sm:h-20 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                  ) : (
                    IconComponent && <IconComponent className="h-8 w-8 text-green-600" />
                  )}
                  <span className="text-sm font-bold text-gray-900">{cat.name}</span>
                  <span className="text-xs text-gray-500">{count} products</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ── Step 2: Product ── */}
      {step === "product" && (
        <>
          <div className="mb-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Choose your{" "}
              <span className="text-green-600">{selectedCategoryData?.name?.toLowerCase()}</span>
            </h1>
            <p className="mt-2 text-gray-600">{categoryProducts.length} products available</p>
          </div>
          <div className="space-y-4">
            {categoryProducts.map((product, index) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  trackSelectProduct({ id: product.id, name: product.name, price: product.price });
                  trackFunnelStep(2, "product");
                  setStep("plan");
                }}
                className="w-full rounded-2xl border-2 border-gray-200 bg-white p-5 text-left transition-all hover:border-green-400 hover:shadow-lg active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Big product image */}
                {product.image && (
                  <div className="w-full h-40 sm:h-48 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center mb-3">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" loading="lazy" />
                  </div>
                )}

                {/* Name + Price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{product.name}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">{product.model}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-gray-900">{formatKES(product.price)}</p>
                    <p className="text-sm font-semibold text-green-600">
                      From {formatKES(product.monthly[6])}/mo
                    </p>
                  </div>
                </div>

                {/* All features */}
                {product.features && product.features.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Deposit badge */}
                <div className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                    Deposit: {formatKES(product.deposit)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Step 3: Plan ── */}
      {step === "plan" && selectedProduct && (
        <>
          <div className="mb-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Choose your{" "}
              <span className="text-green-600">payment plan</span>
            </h1>
            <p className="mt-2 text-gray-600">
              {selectedProduct.name} — Deposit: {formatKES(selectedProduct.deposit)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Price</span>
              <span className="font-bold">{formatKES(selectedProduct.price)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Deposit (40%)</span>
              <span className="font-bold text-green-600">{formatKES(selectedProduct.deposit)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Balance to pay</span>
              <span className="font-bold">{formatKES(selectedProduct.balance)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {([3, 4, 5, 6] as const).map((months, index) => (
              <button
                key={months}
                onClick={() => {
                  setSelectedMonths(months);
                  trackSelectPlan(months, selectedProduct.monthly[months], selectedProduct.id, selectedProduct.price);
                  trackFunnelStep(3, "plan");
                  setStep("crb");
                }}
                className="flex flex-col items-center gap-1 rounded-xl border-2 border-gray-200 bg-white p-5 text-center transition-all hover:border-green-400 hover:shadow-md active:scale-95 animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <span className="text-3xl font-bold text-gray-900">{months}</span>
                <span className="text-sm text-gray-500">months</span>
                <span className="mt-2 text-lg font-bold text-green-600">
                  {formatKES(selectedProduct.monthly[months])}/mo
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Step 4: CRB ── */}
      {step === "crb" && (
        <>
          <div className="mb-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Are you listed on{" "}
              <span className="text-green-600">CRB?</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Credit Reference Bureau — this helps us assess your application.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setCrbStatus("no");
                trackCrbAnswer("no");
                trackFunnelStep(4, "crb");
                setStep("details");
              }}
              className="w-full rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-green-400 hover:shadow-md active:scale-[0.98] animate-in fade-in zoom-in-95 duration-500"
            >
              <span className="text-xl font-bold text-gray-900">No, I'm not listed</span>
              <p className="mt-1 text-sm text-gray-500">I have a clear credit record</p>
            </button>

            <button
              onClick={() => {
                setCrbStatus("yes");
                trackCrbAnswer("yes");
                trackFunnelStep(4, "crb_disqualified");
                setStep("crb_disqualified");
              }}
              className="w-full rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-amber-400 hover:shadow-md active:scale-[0.98] animate-in fade-in zoom-in-95 duration-500 delay-75"
            >
              <span className="text-xl font-bold text-gray-900">Yes, I am listed</span>
              <p className="mt-1 text-sm text-gray-500">This may affect your eligibility</p>
            </button>
          </div>
        </>
      )}

      {/* ── CRB Disqualified ── */}
      {step === "crb_disqualified" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Unfortunately, you don't qualify
          </h1>
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Applicants listed on CRB (Credit Reference Bureau) are not eligible for our hire purchase plans at this time.
          </p>
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 text-left max-w-sm mx-auto">
            <h3 className="font-bold text-gray-900 mb-2">What you can do:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">1.</span>
                Clear your CRB listing with your lender
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">2.</span>
                Get a clearance certificate from CRB
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">3.</span>
                Come back and apply again
              </li>
            </ul>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Questions? Call us: {SITE_CONFIG.phone}
          </p>
          <button
            onClick={handleRestart}
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-gray-400 active:scale-95"
          >
            Start Over
          </button>
        </div>
      )}

      {/* ── Step 5: Personal Details ── */}
      {step === "details" && (
        <PersonalDetailsStep
          onSubmit={(data) => {
            setPersonalDetails(data);
            trackFunnelStep(5, "details");
            setStep("review");
          }}
        />
      )}

      {/* ── Step 6: Review ── */}
      {step === "review" && selectedProduct && selectedMonths && crbStatus && personalDetails && (
        <ApplicationReview
          fullName={personalDetails.fullName}
          phone={personalDetails.phone}
          idNumber={personalDetails.idNumber}
          product={selectedProduct}
          planMonths={selectedMonths}
          crbStatus={crbStatus}
          onSubmit={handleSubmit}
          onBack={() => setStep("upload")}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Back Button — hide on confirmed and review (review has its own back) */}
      {step !== "confirmed" && step !== "crb_disqualified" && step !== "review" && step !== "category" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 p-4 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="mx-auto max-w-2xl flex justify-center">
            <button
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-green-600 px-8 py-3 text-base font-bold text-green-600 bg-white transition-all hover:scale-105 active:scale-95 shadow-sm"
              onClick={handleBack}
            >
              <ChevronLeft className="size-4" />
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
