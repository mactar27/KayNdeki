import { NextRequest, NextResponse } from "next/server"
import webpush from "web-push"
import { getAllSubscriptions, deleteSubscription } from "@/lib/push-db"

export async function POST(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      console.warn("VAPID keys missing. Notifications disabled.")
      return NextResponse.json({ success: false, error: "VAPID keys not configured" })
    }

    webpush.setVapidDetails(
      "mailto:admin@kayndeki.sn",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    )

    const { title, body, url } = await req.json()

    const subscriptions = await getAllSubscriptions()
    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, sent: 0 })
    }

    const payload = JSON.stringify({ title, body, url: url || "/admin", tag: "new-order" })

    let sent = 0
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        sent++
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await deleteSubscription(sub.endpoint)
        }
      }
    }

    return NextResponse.json({ success: true, sent })
  } catch (error) {
    console.error("Push notify error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
