
import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineStatusProps {
  className?: string;
  pendingChanges?: number;
}

export function OfflineStatus({ className, pendingChanges = 0 }: OfflineStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    
    function handleOffline() {
      setIsOnline(false);
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (isOnline && pendingChanges === 0) {
    return null;
  }
  
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md',
        isOnline ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700',
        className
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Sincronizando {pendingChanges} {pendingChanges === 1 ? 'cambio' : 'cambios'}</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Modo sin conexión {pendingChanges > 0 ? `(${pendingChanges} ${pendingChanges === 1 ? 'cambio pendiente' : 'cambios pendientes'})` : ''}</span>
        </>
      )}
    </div>
  );
}
