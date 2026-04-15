import { SITE_CONFIG } from "../data/site-config";
import type { Product } from "../data/products";

export interface ApplicationData {
  fullName: string;
  phone: string;
  idNumber: string;
  product: Product;
  planMonths: 3 | 4 | 5 | 6;
  crbStatus: "yes" | "no";
}

export async function submitApplication(data: ApplicationData): Promise<boolean> {
  const webhookUrl = SITE_CONFIG.googleSheetsWebhook;
  if (!webhookUrl) {
    console.warn("[QuotaPay] No Google Sheets webhook URL configured");
    return false;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    fullName: data.fullName,
    phone: data.phone,
    idNumber: data.idNumber,
    productName: data.product.name,
    productModel: data.product.model,
    totalPrice: data.product.price,
    deposit: data.product.deposit,
    monthlyPayment: data.product.monthly[data.planMonths],
    planMonths: data.planMonths,
    crbStatus: data.crbStatus,
  };

  const body = JSON.stringify(payload);
  console.log("[QuotaPay] Submitting application...", { name: data.fullName, product: data.product.name });

  try {
    await postViaIframe(webhookUrl, body);
    console.log("[QuotaPay] Application submitted successfully");
    return true;
  } catch (error) {
    console.error("[QuotaPay] Submit failed:", error);
    return false;
  }
}

function postViaIframe(url: string, jsonBody: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframeName = "quotapay_submit_" + Date.now();
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.target = iframeName;
    form.style.display = "none";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "payload";
    input.value = jsonBody;
    form.appendChild(input);
    document.body.appendChild(form);

    let resolved = false;
    iframe.onload = () => {
      if (resolved) return;
      resolved = true;
      setTimeout(() => {
        document.body.removeChild(iframe);
        document.body.removeChild(form);
      }, 1000);
      resolve();
    };

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        try { document.body.removeChild(iframe); document.body.removeChild(form); } catch {}
        reject(new Error("Submit timeout"));
      }
    }, 30000);

    form.submit();
  });
}
