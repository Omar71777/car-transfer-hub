
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear moneda (EUR)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Generar un ID único
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Capitalize first letter of each string
export function capitalizeFirstLetter(text: string | undefined | null): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Capitalize first letter of each word in a sentence
export function capitalizeWords(text: string | undefined | null): string {
  if (!text) return '';
  return text.split(' ').map(word => capitalizeFirstLetter(word)).join(' ');
}
