
import { useState, useEffect, useCallback } from 'react';
import { DeviceService } from '@/services/DeviceService';
import { toast } from 'sonner';

type SyncItem<T> = {
  id: string;
  data: T;
  operation: 'create' | 'update' | 'delete';
  timestamp: number;
};

export function useOfflineSync<T extends { id: string }>(
  storageKey: string,
  syncFunction: (items: SyncItem<T>[]) => Promise<boolean>
) {
  const [queue, setQueue] = useState<SyncItem<T>[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Load queue from storage on mount
  useEffect(() => {
    async function loadQueue() {
      const savedQueue = await DeviceService.getData(storageKey);
      if (savedQueue) {
        setQueue(savedQueue);
      }
    }
    
    loadQueue();
    
    // Set up online/offline event listeners
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Conexión restablecida');
      synchronize();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Trabajando sin conexión');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [storageKey]);
  
  // Save queue to storage whenever it changes
  useEffect(() => {
    if (queue.length > 0) {
      DeviceService.storeData(storageKey, queue);
    } else {
      DeviceService.removeData(storageKey);
    }
  }, [queue, storageKey]);
  
  // Add item to sync queue
  const addToQueue = useCallback((data: T, operation: 'create' | 'update' | 'delete') => {
    const item: SyncItem<T> = {
      id: data.id,
      data,
      operation,
      timestamp: Date.now()
    };
    
    setQueue(prev => [...prev, item]);
    
    if (isOnline) {
      synchronize();
    } else {
      toast.info('Cambios guardados localmente', {
        description: 'Se sincronizarán cuando vuelvas a estar en línea'
      });
    }
    
    return data;
  }, [isOnline]);
  
  // Synchronize queue with server
  const synchronize = useCallback(async () => {
    if (queue.length === 0 || isSyncing || !isOnline) return false;
    
    setIsSyncing(true);
    
    try {
      const success = await syncFunction(queue);
      
      if (success) {
        setQueue([]);
        toast.success('Datos sincronizados correctamente');
      } else {
        toast.error('Error al sincronizar datos');
      }
      
      setIsSyncing(false);
      return success;
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Error al sincronizar datos');
      setIsSyncing(false);
      return false;
    }
  }, [queue, isSyncing, isOnline, syncFunction]);
  
  return {
    addToQueue,
    synchronize,
    queueCount: queue.length,
    isSyncing,
    isOnline,
    pendingItems: queue
  };
}
