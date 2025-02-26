import { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <p className="text-sm text-gray-700">
          📱 Install Streaker on your phone for the best experience!
        </p>
        <button
          onClick={handleInstallClick}
          className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;