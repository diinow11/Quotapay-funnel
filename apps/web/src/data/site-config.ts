export const SITE_CONFIG = {
  name: "QuotaPay",
  tagline: "Split It Your Way",
  description: "Buy Hisense electronics on affordable hire purchase plans",
  phone: "0724 200 456",
  whatsappNumber: "254724200456",
  email: "info@myquotapay.com",
  depositRate: 0.4,
  interestRate: 0,
  minMonths: 3,
  maxMonths: 6,
  brand: "Hisense",
  // Google Sheets webhook URL — set this after creating your Apps Script
  // See GOOGLE_SHEETS_SETUP.md for instructions
  googleSheetsWebhook: "https://script.google.com/macros/s/AKfycbzK7s-AogJiy71yFBef-LvJJMP_x_vroeCcc94uZ2YClcH79QjmqGykfz4vmCuj4VB_/exec",
  // TikTok Pixel ID — set this after creating your pixel in TikTok Ads Manager
  // See TIKTOK_SETUP.md for instructions
  tiktokPixelId: "",
  qualificationRequirements: [
    "A valid National ID",
    "A guarantor",
    "Last 3 months of M-Pesa or bank statements",
    "Sign the agreement",
  ],
  valueProps: [
    { title: "0% Interest", description: "No hidden charges or interest fees", icon: "Percent" },
    { title: "40% Deposit", description: "Pay just 40% upfront to take your item home", icon: "Wallet" },
    { title: "3–6 Month Plans", description: "Flexible monthly payments that fit your budget", icon: "CalendarDays" },
    { title: "No Hidden Fees", description: "What you see is what you pay", icon: "ShieldCheck" },
  ],
} as const;
