# TikTok Ads Tracking Setup — Step by Step

This connects your QuotaPay website to TikTok Ads so TikTok knows who visited your site, who started the funnel, and who submitted an application. This data makes your ads smarter — TikTok shows your ads to people most likely to apply.

---

## What TikTok Will Track (Already Built Into Your Site)

| When customer does this... | TikTok sees this event | Why it matters |
|---|---|---|
| Lands on your site | **PageView** | Counts ad clicks that reached your site |
| Picks a category (TV, Fridge, etc.) | **ViewContent** | Shows interest in a product type |
| Picks a specific product | **AddToCart** | Serious interest — considering a purchase |
| Picks a payment plan | **InitiateCheckout** | Very serious — choosing how to pay |
| Submits application | **CompleteRegistration** | This is your conversion — a qualified lead |

TikTok uses these events to:
- **Optimize your ads** — show ads to people who are most likely to complete applications
- **Build lookalike audiences** — find more people like your converters
- **Measure ROI** — see how many applications each ad generates

---

## Part 1: Get Your TikTok Pixel ID

1. Go to **TikTok Ads Manager**: ads.tiktok.com
2. Log in with your TikTok account (or create a business account)
3. In the top menu, go to **Assets → Events**
4. Click **Manage** under "Web Events"
5. Click **Set Up Web Events**
6. Choose **TikTok Pixel** and click **Next**
7. Name your pixel: **QuotaPay Website**
8. Choose **Manually Install Pixel Code**
9. Choose **Standard Mode** (not Developer Mode)
10. You'll see your **Pixel ID** — it's a number like `CP7R5ABC123DEF456`
11. **COPY THIS PIXEL ID**

---

## Part 2: Add the Pixel ID to Your Site

1. Open `apps/web/src/data/site-config.ts`
2. Find this line:
   ```
   tiktokPixelId: "",
   ```
3. Paste your Pixel ID:
   ```
   tiktokPixelId: "CP7R5ABC123DEF456",
   ```
4. Save the file

---

## Part 3: Rebuild and Deploy

```bash
pnpm --filter web build
```

Then deploy to your hosting.

---

## Part 4: Verify It's Working

### Method 1: TikTok Pixel Helper (Recommended)
1. Install the **TikTok Pixel Helper** Chrome extension from the Chrome Web Store
2. Go to your live website
3. Click the TikTok Pixel Helper icon in your browser toolbar
4. It should show a green checkmark and say "PageView" detected
5. Click through the funnel — you should see ViewContent, AddToCart, InitiateCheckout, CompleteRegistration events appear

### Method 2: TikTok Events Manager
1. Go to TikTok Ads Manager → Assets → Events
2. Click your pixel
3. Go to the **Overview** or **Diagnostics** tab
4. Visit your website and complete the funnel
5. Events should appear within a few minutes (can take up to 20 min)

---

## Part 5: Set Up Your TikTok Ad Campaign

Now that tracking works, here's how to optimize your ads:

### Campaign Objective
Choose **Lead Generation** or **Website Conversions**

### Optimization Event
- Start with **ViewContent** (category selection) — this gives TikTok more data to learn from
- Once you get 50+ ViewContent events per week, switch to **AddToCart** (product selection)
- Once you get 50+ AddToCart per week, switch to **CompleteRegistration** (application submitted)
- This "stepping up" approach gives TikTok enough data at each stage to optimize properly

### Why Start Low?
TikTok needs ~50 conversion events per week to optimize well. If you optimize for CompleteRegistration from day one but only get 5 applications/week, TikTok won't have enough data and your ads will perform poorly. Start with ViewContent (higher volume), let TikTok learn, then step up.

---

## Event Details Sent to TikTok

Each event includes rich data so TikTok can optimize better:

**ViewContent (category selected):**
```
content_type: "product_group"
content_id: "television" (the category slug)
```

**AddToCart (product selected):**
```
content_type: "product"
content_id: "tv-55u7n" (the product ID)
content_name: "Hisense 55\" Mini-LED ULED 144Hz (U7)"
price: 93850
currency: "KES"
```

**InitiateCheckout (plan selected):**
```
content_type: "product"
content_id: "tv-55u7n"
value: 93850
currency: "KES"
```

**CompleteRegistration (application submitted):**
```
content_type: "product"
content_id: "tv-55u7n"
value: 93850
currency: "KES"
```

---

## Troubleshooting

**"TikTok Pixel Helper shows no pixel"**
- Make sure `tiktokPixelId` in `site-config.ts` is not empty
- Make sure you rebuilt and redeployed
- Hard refresh the page (Ctrl+Shift+R)

**"Events not showing in TikTok Events Manager"**
- Events can take up to 20 minutes to appear
- Make sure you're testing on the LIVE deployed site, not localhost
- Check browser console for JavaScript errors

**"I want to change my Pixel ID"**
- Just update the `tiktokPixelId` value in `site-config.ts`, rebuild, redeploy

**"Should I also set up TikTok Events API (server-side)?"**
- For now, the browser pixel is enough. Server-side tracking is more reliable but requires a backend. You can add it later if needed.
