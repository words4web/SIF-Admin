importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

firebase.initializeApp({
  apiKey: "AIzaSyDhfv3ac24ebuP6oB0UvmUJSqA2ssUq538",
  authDomain: "indian-supplies.firebaseapp.com",
  projectId: "indian-supplies",
  storageBucket: "indian-supplies.firebasestorage.app",
  messagingSenderId: "851086484761",
  appId: "1:851086484761:web:8a1befadd85b3f576d9188",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  if (!payload?.notification && payload?.data) {
    const data = payload?.data;
    const title = data?.title || "Shelly Indian Foods Admin";
    const body = data?.body || "You have a new update.";

    const notificationOptions = {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      color: "#16a34a",
      data: payload?.data,
      vibrate: [200, 100, 200],
      requireInteraction: false,
      timestamp: Date.now(),
      tag: data?.orderId || data?.type || "admin-general",
      renotify: true,
      actions: [
        {
          action: "view",
          title: "View",
        },
      ],
    };

    self.registration.showNotification(title, notificationOptions);
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const data = event?.notification?.data || {};
  let targetPath = "/";

  if (data?._id || data?.orderId) {
    targetPath = data?._id ? `/orders/${data?._id}` : "/orders";
  } else {
    targetPath = "/";
  }

  const targetUrl = new URL(targetPath, self.location.origin);

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          try {
            const clientUrl = new URL(client.url);
            if (clientUrl.pathname === targetPath && "focus" in client) {
              return client.focus();
            }
          } catch (urlErr) {
            console.error("Failed to parse client URL:", urlErr);
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl.href);
        }
      })
      .catch((err) => {
        console.error("Notification click handler failed:", err);
      }),
  );
});
