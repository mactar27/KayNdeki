"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Check } from "lucide-react"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushNotificationToggle() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported")
      return
    }
    setPermission(Notification.permission)
    if (Notification.permission === "granted") {
      checkExistingSubscription()
    }
  }, [])

  const checkExistingSubscription = async () => {
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      setSubscribed(!!sub)
    } catch {}
  }

  const enableNotifications = async () => {
    if (!("serviceWorker" in navigator)) return
    setLoading(true)
    try {
      // Register service worker
      const reg = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready

      // Request permission
      const perm = await Notification.requestPermission()
      setPermission(perm)

      if (perm !== "granted") {
        setLoading(false)
        return
      }

      // Subscribe to push
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      // Save to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      })

      setSubscribed(true)
    } catch (err) {
      console.error("Failed to enable push notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  const disableNotifications = async () => {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setSubscribed(false)
      setPermission("default")
    } catch (err) {
      console.error("Failed to disable notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  if (permission === "unsupported") return null

  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${subscribed ? "bg-green-100" : "bg-slate-100"}`}>
        {subscribed ? (
          <Bell className="h-5 w-5 text-green-600" />
        ) : (
          <BellOff className="h-5 w-5 text-slate-400" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-800 text-sm">
          {subscribed ? "Notifications activées" : "Activer les notifications"}
        </p>
        <p className="text-xs text-slate-500">
          {subscribed
            ? "Vous recevrez une alerte à chaque nouvelle commande."
            : "Soyez alerté en temps réel des nouvelles commandes."}
        </p>
      </div>
      <button
        onClick={subscribed ? disableNotifications : enableNotifications}
        disabled={loading || permission === "denied"}
        className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
          subscribed
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-[#1A56DB] text-white hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <span className="animate-spin">⟳</span>
        ) : subscribed ? (
          <><Check className="h-3.5 w-3.5" /> Activé</>
        ) : (
          <><Bell className="h-3.5 w-3.5" /> Activer</>
        )}
      </button>
      {permission === "denied" && (
        <p className="text-xs text-red-500">Bloqué par le navigateur</p>
      )}
    </div>
  )
}
