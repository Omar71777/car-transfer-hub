
/**
 * Utility functions for type validation and checking
 */

import { toast } from 'sonner';

/**
 * Validates that an object has all required properties of a type
 * and shows a toast error if any are missing.
 * 
 * @param obj The object to validate
 * @param requiredProps Array of required property names
 * @param objectName Name of the object (for error messages)
 * @returns Boolean indicating if validation passed
 */
export function validateRequiredProps<T extends object>(
  obj: Partial<T>, 
  requiredProps: Array<keyof T>, 
  objectName: string = 'object'
): boolean {
  const missingProps = requiredProps.filter(prop => obj[prop] === undefined);
  
  if (missingProps.length > 0) {
    const missingPropsStr = missingProps.join(', ');
    console.error(`${objectName} missing required properties: ${missingPropsStr}`, obj);
    toast.error(`Error: ${objectName} missing ${missingProps.length > 1 ? 'properties' : 'property'}: ${missingPropsStr}`);
    return false;
  }
  
  return true;
}

/**
 * Ensures an object is of the correct type for database operations
 * by adding any missing default properties
 * 
 * @param data The partial data object
 * @param defaults Default values for missing properties
 * @returns Complete object with defaults applied where needed
 */
export function ensureCompleteObject<T extends object>(data: Partial<T>, defaults: Partial<T>): T {
  return {
    ...defaults,
    ...data
  } as T;
}

/**
 * Creates a typed subset of an object with only the specified keys
 * 
 * @param obj Original object
 * @param keys Keys to pick from the object
 * @returns New object with only the specified keys
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * Creates a typed subset of an object omitting the specified keys
 * 
 * @param obj Original object
 * @param keys Keys to omit from the object
 * @returns New object without the specified keys
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result as Omit<T, K>;
}
