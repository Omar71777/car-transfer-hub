
import { useState, useCallback } from 'react';
import { DeviceService } from '@/services/DeviceService';
import { Position } from '@capacitor/geolocation';

export function useDevice() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Camera hooks
  const takePicture = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await DeviceService.takePicture();
      setIsLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error taking picture');
      setIsLoading(false);
      return null;
    }
  }, []);
  
  const selectPicture = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await DeviceService.selectPicture();
      setIsLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error selecting picture');
      setIsLoading(false);
      return null;
    }
  }, []);
  
  // Geolocation hooks
  const [position, setPosition] = useState<Position | null>(null);
  
  const getCurrentPosition = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pos = await DeviceService.getCurrentPosition();
      setPosition(pos);
      setIsLoading(false);
      return pos;
    } catch (err: any) {
      setError(err.message || 'Error getting position');
      setIsLoading(false);
      return null;
    }
  }, []);
  
  // Storage hooks
  const storeData = useCallback(async (key: string, value: any) => {
    setError(null);
    try {
      await DeviceService.storeData(key, value);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error storing data');
      return false;
    }
  }, []);
  
  const getData = useCallback(async (key: string) => {
    setError(null);
    try {
      return await DeviceService.getData(key);
    } catch (err: any) {
      setError(err.message || 'Error getting data');
      return null;
    }
  }, []);
  
  const removeData = useCallback(async (key: string) => {
    setError(null);
    try {
      await DeviceService.removeData(key);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error removing data');
      return false;
    }
  }, []);
  
  // Sharing hook
  const shareContent = useCallback(async (title: string, text: string, url?: string) => {
    setError(null);
    try {
      await DeviceService.shareContent(title, text, url);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error sharing content');
      return false;
    }
  }, []);
  
  // Check if running on native device
  const isNative = DeviceService.isNative();
  
  return {
    isLoading,
    error,
    isNative,
    // Camera
    takePicture,
    selectPicture,
    // Geolocation
    position,
    getCurrentPosition,
    // Storage
    storeData,
    getData,
    removeData,
    // Sharing
    shareContent,
    // Push notifications
    initializePushNotifications: DeviceService.initializePushNotifications
  };
}
