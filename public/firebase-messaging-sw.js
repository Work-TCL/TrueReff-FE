/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js"
);

// ✅ Initialize Firebase
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
});

// ✅ Get messaging instance
const messaging = firebase.messaging();

// ✅ Handle background notification
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = "Truereff Notification";
  const data = JSON.parse(payload?.data?.payload ?? "{}")
  console.log("Payload data:", data);
  if (data?.message) {
    const notificationOptions = {
      body: data?.message,
      icon: "https://truereff.com/favicon.ico",
      data: {
        url:
          "https://www.truereff.com" + data?.path || "https://www.truereff.com", // 👈 redirect target
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

// ✅ Handle notification click redirect
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click: ", event.notification);
  event.notification.close();

  const redirectUrl =
    event.notification.data?.path || "https://truereff.com";

  // Focus existing tab or open a new one
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === redirectUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(redirectUrl);
        }
      })
  );
});
