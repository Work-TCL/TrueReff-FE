export function isWebView() {
    const ua = navigator.userAgent || "";
    return (
      /\bwv\b/.test(ua) ||                           // Android WebView
      /Android.*Version\/\d+\.\d+/.test(ua) && !/Chrome/.test(ua) || // no real Chrome
      typeof (window as any).ReactNativeWebView !== "undefined"        // RN WebView (fixed TS error)
    );
  }