
import { capitalizeFirstLetter } from './utils';

// Field names that should be capitalized in all components
const TEXT_FIELDS_TO_CAPITALIZE = [
  'name', 'title', 'description', 'label', 'origin', 'destination', 
  'collaborator', 'status', 'type', 'message', 'city', 'address'
];

// This function can be applied to data returned from server/API calls
export function capitalizeTextFields<T extends Record<string, any>>(data: T): T {
  if (!data) return data;
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => capitalizeTextFields(item)) as unknown as T;
  }
  
  // Handle objects
  if (typeof data === 'object' && data !== null) {
    const result = { ...data };
    
    for (const key in result) {
      // If it's a known text field, capitalize it
      if (TEXT_FIELDS_TO_CAPITALIZE.includes(key) && typeof result[key] === 'string') {
        result[key] = capitalizeFirstLetter(result[key]);
      }
      // If it's an object or array, recurse
      else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = capitalizeTextFields(result[key]);
      }
    }
    
    return result;
  }
  
  return data;
}

// Higher-order function to add capitalization to any data loading function
export function withCapitalizedData<T extends (...args: any[]) => Promise<any>>(
  fetchFunction: T
): T {
  return (async (...args: Parameters<T>) => {
    const result = await fetchFunction(...args);
    return capitalizeTextFields(result);
  }) as T;
}
