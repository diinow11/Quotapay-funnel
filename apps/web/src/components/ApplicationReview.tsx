import * as React from "react";
import type { Product } from "../data/products";
import { formatKES } from "../data/products";
import { SITE_CONFIG } from "../data/site-config";
import { MessageCircle, Loader2 } from "lucide-react";

interface ApplicationReviewProps {
  fullName: string;
  phone: string;
  idNumber: string;
  product: Product;
  planMonths: 3 | 4 | 5 | 6;
  crbStatus: "yes" | "no";
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function ApplicationReview({
  fullName,
  phone,
  idNumber,
  product,
  planMonths,
  crbStatus,
  onSubmit,
  onBack,
  isSubmitting,
}: ApplicationReviewProps) {
  const monthlyPayment = product.monthly[planMonths];

  const whatsappMessage = [
    `Hi, I'd like to apply for hire purchase.`,
    ``,
    `*Product:* ${product.name}`,
    `*Model:* ${product.model}`,
    `*Total Price:* ${formatKES(product.price)}`,
    `*Deposit (40%):* ${formatKES(product.deposit)}`,
    `*Plan:* ${planMonths} months at ${formatKES(monthlyPayment)}/mo`,
    ``,
    `*Name:* ${fullName}`,
    `*Phone:* ${phone}`,
    `*ID Number:* ${idNumber}`,
    `*CRB:* ${crbStatus === "no" ? "Not listed" : "Listed"}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleSubmit = () => {
    // Send data to Google Sheet in background
    onSubmit();
    // WhatsApp opens via the <a> tag href — no popup blocker issues
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Review your <span className="text-green-600">application</span>
        </h1>
        <p className="mt-2 text-gray-600">Confirm your details, then submit via WhatsApp.</p>
      </div>

      {/* Personal Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Full Name</span>
            <span className="font-semibold text-gray-900">{fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone</span>
            <span className="font-semibold text-gray-900">{phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">National ID</span>
            <span className="font-semibold text-gray-900">{idNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">CRB Status</span>
            <span className={`font-semibold ${crbStatus === "no" ? "text-green-600" : "text-amber-600"}`}>
              {crbStatus === "no" ? "Not listed" : "Listed"}
            </span>
          </div>
        </div>
      </div>

      {/* Product & Plan */}
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Product & Payment Plan</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Product</span>
            <span className="font-semibold text-gray-900 text-right">{product.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Model</span>
            <span className="font-semibold text-gray-900">{product.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Price</span>
            <span className="font-bold text-gray-900">{formatKES(product.price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Deposit (40%)</span>
            <span className="font-bold text-green-600">{formatKES(product.deposit)}</span>
          </div>
          <hr className="border-green-200" />
          <div className="flex justify-between">
            <span className="text-gray-600">Plan</span>
            <span className="font-bold text-gray-900">{planMonths} months</span>
          </div>
          <div className="flex justify-between items-center rounded-lg bg-green-600 px-3 py-2 -mx-1">
            <span className="font-semibold text-green-100">Monthly Payment</span>
            <span className="text-xl font-bold text-white">{formatKES(monthlyPayment)}/mo</span>
          </div>
        </div>
      </div>

      {/* Submit via WhatsApp — <a> tag, not window.open, so no popup blocker */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleSubmit}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <MessageCircle className="h-5 w-5" />
            Submit on WhatsApp
          </>
        )}
      </a>

      <p className="mt-2 text-center text-xs text-gray-500">
        Your details are sent to our team instantly. We'll respond in the chat.
      </p>

      <button
        onClick={onBack}
        disabled={isSubmitting}
        className="mt-3 w-full rounded-xl border-2 border-gray-300 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-gray-400 active:scale-95 disabled:opacity-50"
      >
        Go Back & Edit
      </button>
    </div>
  );
}
