import * as React from "react";
import type { Product } from "../data/products";
import { formatKES } from "../data/products";
import { Check, Loader2 } from "lucide-react";

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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Review your <span className="text-green-600">application</span>
        </h1>
        <p className="mt-2 text-gray-600">Make sure everything looks correct before submitting.</p>
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
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 mb-4">
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

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-green-700 active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </button>

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
