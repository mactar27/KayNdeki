// Service Worker - Kay Ndeki Push Notifications
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('push', function(event) {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch(e) {
    data = { title: 'Kay Ndeki', body: event.data ? event.data.text() : 'Nouvelle notification' }
  }

  const title = data.title || 'Kay Ndeki 🥐'
  const options = {
    body: data.body || 'Vous avez une nouvelle notification.',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    image: data.image || undefined,
    tag: data.tag || 'kayndeki',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: data.actions || []
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})
