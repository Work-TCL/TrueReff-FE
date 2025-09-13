// public/firebase-messaging-sw.js

// Import the Firebase scripts (must be compat for service worker!)
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyABfVhx4Yd70PlKMAypvu0i2Fsaz_V-9fA",
  authDomain: "truereff-dec3e.firebaseapp.com",
  projectId: "truereff-dec3e",
  storageBucket: "truereff-dec3e.firebasestorage.app",
  messagingSenderId: "12015132178",
  appId: "1:12015132178:web:d59b64737c5c1e7fbb02cb",
  measurementId: "G-8WKYZ55KDG"
});

// Retrieve firebase messaging
export const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);
  console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  const notificationTitle = payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body || "Background Message body.",
    icon: "/assets/common/truereff-logo.svg"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
