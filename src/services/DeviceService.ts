
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { Share } from '@capacitor/share';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { toast } from 'sonner';

export class DeviceService {
  // Camera functionality
  static async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      
      return image.webPath;
    } catch (error) {
      console.error('Error taking picture:', error);
      toast.error('No se pudo capturar la imagen');
      return null;
    }
  }

  static async selectPicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });
      
      return image.webPath;
    } catch (error) {
      console.error('Error selecting picture:', error);
      toast.error('No se pudo seleccionar la imagen');
      return null;
    }
  }

  // Geolocation functionality
  static async getCurrentPosition(): Promise<Position | null> {
    try {
      return await Geolocation.getCurrentPosition();
    } catch (error) {
      console.error('Error getting current position:', error);
      toast.error('No se pudo obtener la ubicación actual');
      return null;
    }
  }

  // Local storage functionality
  static async storeData(key: string, value: any): Promise<void> {
    try {
      await Preferences.set({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      });
    } catch (error) {
      console.error('Error storing data:', error);
      toast.error('No se pudo guardar los datos localmente');
    }
  }

  static async getData(key: string): Promise<any> {
    try {
      const { value } = await Preferences.get({ key });
      
      if (!value) return null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Error getting data:', error);
      toast.error('No se pudo recuperar los datos locales');
      return null;
    }
  }

  static async removeData(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error('Error removing data:', error);
      toast.error('No se pudo eliminar los datos locales');
    }
  }

  // Sharing functionality
  static async shareContent(title: string, text: string, url?: string): Promise<void> {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: 'Compartir contenido'
      });
    } catch (error) {
      console.error('Error sharing content:', error);
      toast.error('No se pudo compartir el contenido');
    }
  }

  // Push notifications
  static async initializePushNotifications(): Promise<void> {
    try {
      // Request permission to use push notifications
      const result = await PushNotifications.requestPermissions();
      
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register();
        
        // Setup event listeners
        PushNotifications.addListener('registration', (token: Token) => {
          console.log('Push registration success, token:', token.value);
        });
        
        PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Error on registration:', error);
        });
        
        PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
          console.log('Push notification received:', notification);
          toast.info(notification.title, {
            description: notification.body
          });
        });
        
        PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
          console.log('Push notification action performed:', notification);
        });
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      toast.error('No se pudo inicializar las notificaciones push');
    }
  }

  // Network status
  static isNative(): boolean {
    return window.Capacitor && window.Capacitor.isNative;
  }
}
