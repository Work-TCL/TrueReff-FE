// public/firebase-messaging-sw.js

// Import the Firebase scripts (must be compat for service worker!)
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");
import { firebaseConfig } from "./notifications/firebaseConfig";
console.log("Firebase config in SW:", firebaseConfig);

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
export const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body || "Background Message body.",
    icon: "/assets/common/truereff-logo.svg"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
