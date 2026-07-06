import { NextRequest, NextResponse } from "next/server"
import { savePushSubscription, createPushSubscriptionTable } from "@/lib/push-db"

export async function POST(req: NextRequest) {
  try {
    const sub = await req.json()
    await createPushSubscriptionTable()
    await savePushSubscription(sub)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Push subscribe error:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}
