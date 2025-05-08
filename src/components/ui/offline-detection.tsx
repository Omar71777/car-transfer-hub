
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineDetection() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success('Conexión restablecida', {
          description: 'Tu dispositivo está conectado a Internet nuevamente.',
          icon: <Wifi className="h-4 w-4" />
        });
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.error('Sin conexión a Internet', {
        description: 'No se pueden guardar cambios. Verifica tu conexión.',
        icon: <WifiOff className="h-4 w-4" />,
        duration: Infinity
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Only render something when offline
  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-destructive text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2">
      <WifiOff size={16} />
      <span className="text-sm font-medium">Sin conexión</span>
    </div>
  );
}
