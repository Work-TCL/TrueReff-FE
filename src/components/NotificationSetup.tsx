"use client";
import { Dispatch, SetStateAction, useEffect } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase";

export default function NotificationSetup({ setMessagingToken }: { setMessagingToken: Dispatch<SetStateAction<string | null>> }) {

    useEffect(() => {
        if (!messaging) return;

        // Register Service Worker
        navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then(() => console.log("✅ Service Worker Registered"));

        // Request permission
        Notification.requestPermission().then(async (permission) => {
            console.log("permission", permission);
            if (permission === "granted") {
                console.log("🔥 FCM Token:", "token", process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);
                const token = await getToken(messaging!, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
                });
                console.log("🔥 FCM Token:", token);
                if (token) {
                    localStorage.setItem("fcmToken",token);
                    setMessagingToken(token)
                }

                // TODO: send token to your backend
                // await fetch("/api/save-fcm-token", {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify({ token }),
                // });
            } else {
                console.warn("🚫 Permission not granted for notifications");
            }
        });

        // Foreground messages
        onMessage(messaging!, (payload: any) => {
            console.log("📩 Message received in foreground:", payload);
            // 👇 manually show notification popup
            if (payload.notification?.title) {
                // const data = JSON.parse(payload?.data?.payload)
                
                new Notification("Trureff Notification", {
                    body: payload.notification.title,
                    icon: "https://truereff.com/favicon.ico", // optional icon
                });
            }
        });
    }, []);

    return (
        <></>
    );
}
