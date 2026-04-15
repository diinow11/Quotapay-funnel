import { pushToDataLayer } from "./datalayer-types";
import { SITE_CONFIG } from "../data/site-config";

// ── GA4 (via GTM dataLayer) ──

function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  try {
    pushToDataLayer({ event: eventName, ...params });
  } catch {
    // Silently fail
  }
}

// ── TikTok Pixel ──

declare global {
  interface Window {
    ttq?: {
      load: (pixelId: string) => void;
      page: () => void;
      track: (event: string, data?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
    };
  }
}

let tiktokInitialized = false;

/** Initialize TikTok pixel — call once on page load */
export function initTikTok() {
  if (tiktokInitialized) return;
  if (typeof window === "undefined") return;
  const pixelId = SITE_CONFIG.tiktokPixelId;
  if (!pixelId) return;
  try {
    window.ttq?.load(pixelId);
    window.ttq?.page();
    tiktokInitialized = true;
  } catch {
    // Silently fail
  }
}

function ttTrack(event: string, data?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track(event, data);
    }
  } catch {
    // Silently fail
  }
}

// ── Combined Tracking Functions ──
// Each function fires both GA4 (via dataLayer) and TikTok events

/** Step 1: user picks a category */
export function trackSelectCategory(category: string) {
  trackEvent("select_category", { category_name: category });
  // TikTok: ViewContent — user is browsing a product category
  ttTrack("ViewContent", {
    content_type: "product_group",
    content_id: category,
  });
}

/** Step 2: user picks a product */
export function trackSelectProduct(product: { id: string; name: string; price: number }) {
  trackEvent("select_product", {
    item_id: product.id,
    item_name: product.name,
    value: product.price,
    currency: "KES",
  });
  // TikTok: AddToCart — user selected a specific product
  ttTrack("AddToCart", {
    content_type: "product",
    content_id: product.id,
    content_name: product.name,
    price: product.price,
    currency: "KES",
    value: product.price,
  });
}

/** Step 3: user picks a payment plan */
export function trackSelectPlan(months: number, monthlyAmount: number, productId: string, productPrice: number) {
  trackEvent("select_plan", {
    plan_months: months,
    monthly_amount: monthlyAmount,
    item_id: productId,
    currency: "KES",
  });
  // TikTok: InitiateCheckout — user chose a payment plan
  ttTrack("InitiateCheckout", {
    content_type: "product",
    content_id: productId,
    value: productPrice,
    currency: "KES",
  });
}

/** Step 4: user answers CRB question */
export function trackCrbAnswer(status: "yes" | "no") {
  trackEvent("crb_answer", { crb_status: status });
}

/** Application submitted — the big conversion */
export function trackApplicationSubmitted(product: { id: string; name: string; price: number }) {
  trackEvent("application_submitted", {
    item_id: product.id,
    item_name: product.name,
    value: product.price,
    currency: "KES",
  });
  // TikTok: CompleteRegistration — this is your conversion event
  ttTrack("CompleteRegistration", {
    content_type: "product",
    content_id: product.id,
    value: product.price,
    currency: "KES",
  });
}

/** General WhatsApp click (floating button) */
export function trackWhatsAppClick() {
  trackEvent("whatsapp_click", { source: "floating_button" });
  ttTrack("ClickButton", {
    content_type: "product_group",
    content_id: "whatsapp_general",
  });
}

/** Quiz funnel step tracking */
export function trackFunnelStep(stepNumber: number, stepName: string) {
  trackEvent("funnel_step", {
    step_number: stepNumber,
    step_name: stepName,
  });
}
