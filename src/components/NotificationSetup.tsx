"use client";
import { Dispatch, SetStateAction, useEffect } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import { isWebView } from "@/lib/utils/deviceView";

export default function NotificationSetup({ setMessagingToken }: { setMessagingToken: Dispatch<SetStateAction<string | null>> }) {

    useEffect(() => {
        if (typeof window === "undefined") return;
    
        // ⛔ Block inside APK WebView
        if (isWebView()) {
            console.warn("🚫 Notifications disabled: Running inside WebView APK");
            return;
        }
    
        if (!messaging) return;
    
        (async () => {
            try {
                // Register Service Worker
                await navigator.serviceWorker.register("/firebase-messaging-sw.js");
                console.log("✅ Service Worker Registered");
    
                // Request notification permission
                const permission = await Notification.requestPermission();
                if (permission !== "granted") return;
    
                const token = await getToken(messaging, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                });
    
                if (token) {
                    localStorage.setItem("fcmToken", token);
                    setMessagingToken(token);
                }
            } catch (err) {
                console.error("🔥 FCM error:", err);
            }
        })();
        onMessage(messaging!, (payload: any) => {
            // 👇 manually show notification popup
            const data = JSON.parse(payload?.data?.payload??"{}")
            if (data?.message) {                                
                new Notification("Truereff Notification", {
                    body: data?.message,
                    icon: "https://truereff.com/favicon.ico", // optional icon
                });
            }
        });
    }, []);
    

    return (
        <></>
    );
}
