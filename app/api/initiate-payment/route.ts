import { NextRequest, NextResponse } from "next/server"

// ── These run SERVER-SIDE — set them in Vercel dashboard without NEXT_PUBLIC_ ──
// For local dev, also add to .env.local without NEXT_PUBLIC_ prefix
const FP_API = (
  process.env.FLOWPAY_API_URL ||
  process.env.NEXT_PUBLIC_FLOWPAY_API_URL ||
  "https://flow-pay-api.vercel.app"
).replace(/\/$/, "")

const FP_KEY = process.env.FLOWPAY_API_KEY || process.env.NEXT_PUBLIC_FLOWPAY_API_KEY || ""
const FP_MID = process.env.FLOWPAY_MERCHANT_ID || process.env.NEXT_PUBLIC_FLOWPAY_MERCHANT_ID || ""
const SITE_URL = (
  process.env.FLOWPAY_RETURN_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL ||  // Vercel auto-injects this
  ""
).replace(/\/$/, "")

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      amount,
      fullName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      items,
    } = body

    // Validate required fields
    const missing = []
    if (!amount)       missing.push("amount")
    if (!fullName)     missing.push("fullName")
    if (!addressLine1) missing.push("addressLine1")
    if (!city)         missing.push("city")
    if (!state)        missing.push("state")
    if (!pincode)      missing.push("pincode")
    if (missing.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      )
    }

    // Build FlowPay payload
    const fpPayload: Record<string, unknown> = {
      amount: Number(amount),
      customer_details: {
        name:  fullName,
        email: email || "",
        phone: phone  || "",
      },
      shipping_address: {
        full_name:      fullName,
        address_line_1: addressLine1,
        city,
        state,
        pincode,
        ...(addressLine2?.trim() ? { address_line_2: addressLine2.trim() } : {}),
      },
      items: (items || []).map((i: any) => ({
        name:     i.name,
        quantity: Number(i.quantity),
        price:    Number(i.price),
        image:    i.image || "",
      })),
    }

    // Attach merchant + return URL if configured
    if (FP_MID) fpPayload.merchant_id = FP_MID
    const returnBase = SITE_URL || `https://${req.headers.get("host") || ""}`
    if (returnBase) fpPayload.return_url = `${returnBase}/orders`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (FP_KEY) headers["X-API-Key"] = FP_KEY

    // Log for Vercel function logs (visible in dashboard)
    console.log("[/api/initiate-payment] Sending to FlowPay:", JSON.stringify(fpPayload, null, 2))
    console.log("[/api/initiate-payment] Target:", `${FP_API}/api/checkout`)

    const fpRes = await fetch(`${FP_API}/api/checkout`, {
      method:  "POST",
      headers,
      body:    JSON.stringify(fpPayload),
    })

    const fpJson = await fpRes.json()
    console.log("[/api/initiate-payment] FlowPay response:", JSON.stringify(fpJson))

    if (!fpRes.ok) {
      const detail = typeof fpJson?.detail === "string"
        ? fpJson.detail
        : JSON.stringify(fpJson?.detail ?? fpJson)
      return NextResponse.json(
        { error: detail || `FlowPay API error (HTTP ${fpRes.status})` },
        { status: fpRes.status }
      )
    }

    if (!fpJson?.order_id) {
      return NextResponse.json(
        { error: "FlowPay did not return an order_id" },
        { status: 502 }
      )
    }

    return NextResponse.json({
      order_id:    fpJson.order_id,
      checkout_url: `https://flow-pay-self.vercel.app/pay/${fpJson.order_id}`,
      amount:      fpJson.amount,
      return_url:  fpJson.return_url,
    })
  } catch (err) {
    console.error("[/api/initiate-payment] Unexpected error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
