import { CheckCircle, RotateCcw, Phone, Clock, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "../data/site-config";

interface ApplicationConfirmationProps {
  fullName: string;
  idNumber: string;
  productName: string;
  onRestart: () => void;
}

function getCallbackMessage(): { timeframe: string; detail: string } {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isFriday = day === 5;
  const isSaturday = day === 6;
  const isSunday = day === 0;

  if (isWeekday && hour >= 9 && hour < 14) return { timeframe: "within 2 hours", detail: "Our team is online right now and will call you shortly." };
  if (isWeekday && hour >= 14 && hour < 16) return { timeframe: "by end of day or first thing tomorrow morning", detail: "Our team is wrapping up for the day but will prioritize your application." };
  if (isFriday && hour >= 16) return { timeframe: "tomorrow (Saturday) morning by 11am", detail: "Our Saturday team will review it first thing tomorrow." };
  if (isWeekday && !isFriday && (hour >= 16 || hour < 9)) return { timeframe: "tomorrow morning by 10am", detail: "Our team will review it first thing tomorrow." };
  if (isSaturday && hour >= 9 && hour < 12) return { timeframe: "within 2 hours", detail: "Our team is working this Saturday morning." };
  if (isSaturday && hour >= 12 && hour < 14) return { timeframe: "by 2pm today or Monday morning", detail: "Our Saturday team is wrapping up." };
  if (isSaturday && hour >= 14) return { timeframe: "Monday morning by 10am", detail: "We're closed for the weekend. We'll call first thing Monday." };
  if (isSaturday && hour < 9) return { timeframe: "this morning by 11am", detail: "Our Saturday team starts at 9am." };
  if (isSunday) return { timeframe: "Monday morning by 10am", detail: "We're closed on Sundays. Our team will call first thing Monday." };
  return { timeframe: "within the next business day", detail: "Our team will review your application and call you." };
}

export function ApplicationConfirmation({ fullName, idNumber, productName, onRestart }: ApplicationConfirmationProps) {
  const callback = getCallbackMessage();

  const whatsappMessage = `Hi, I just submitted my hire purchase application for ${productName}.\n\nName: ${fullName}\nID: ${idNumber}\n\nI'm sending my M-Pesa/bank statement (last 3 months) and the passcode to open it.`;
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 bg-white min-h-dvh flex flex-col items-center justify-center text-center">
      {/* Warning icon instead of success — application is NOT complete yet */}
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
        <Clock className="h-10 w-10 text-amber-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900">
        Almost Done, {fullName}!
      </h1>

      <p className="mt-3 max-w-md text-lg text-gray-700">
        Your details are saved. To <strong>complete your application</strong>, send your M-Pesa or bank statement below.
      </p>

      {/* Urgent warning */}
      <div className="mt-4 w-full max-w-sm rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-medium">
        Your application <strong>cannot be processed</strong> without your statement. Send it now to avoid delays.
      </div>

      {/* Big WhatsApp CTA — the main action */}
      <div className="mt-6 w-full max-w-sm">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-5 text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95 animate-[pulse-grow_2s_ease-in-out_infinite]"
        >
          <MessageCircle className="h-6 w-6" />
          Send Statement Now
        </a>
        <p className="mt-3 text-center text-sm text-gray-500">
          Attach your <strong>M-Pesa/bank statement PDF</strong> (last 3 months) and the <strong>passcode</strong> to open it.
        </p>
      </div>

      {/* After they send — what happens */}
      <div className="mt-8 w-full max-w-sm rounded-xl border border-gray-200 bg-gray-50 p-5 text-left">
        <h3 className="font-bold text-gray-900 mb-3">After you send your statement:</h3>
        <ol className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">1</span>
            <span>We review your application and documents</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">2</span>
            <span>We call you <strong>{callback.timeframe}</strong> with a decision</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">3</span>
            <span>If approved, pay your deposit and collect your item</span>
          </li>
        </ol>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
        <Phone className="h-4 w-4" />
        <span>Questions? Call us: {SITE_CONFIG.phone}</span>
      </div>

      <button
        onClick={onRestart}
        className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-gray-400 active:scale-95"
      >
        <RotateCcw className="h-4 w-4" />
        Apply for Another Product
      </button>
    </div>
  );
}
