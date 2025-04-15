'use client';

import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    const prompt = deferredPrompt as any;
    prompt.prompt();

    const choiceResult = await prompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
     
    } else {
      
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-5 right-5 px-4 py-2 bg-black text-white rounded-xl shadow-lg z-50"
    >
      Install App
    </button>
  );
}
