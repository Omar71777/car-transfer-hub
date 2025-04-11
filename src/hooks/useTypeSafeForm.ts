
import { useState } from 'react';
import { toast } from 'sonner';
import { validateRequiredProps } from '@/lib/type-validators';

interface FormOptions<T extends object> {
  initialValues: Partial<T>;
  requiredFields?: Array<keyof T>;
  onSubmit: (values: T) => Promise<any>;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  formName?: string;
  validateForm?: (values: Partial<T>) => Partial<Record<keyof T, string>>;
}

/**
 * A type-safe form handling hook
 */
export function useTypeSafeForm<T extends object>({
  initialValues,
  requiredFields = [],
  onSubmit,
  onSuccess,
  onError,
  formName = 'Form',
  validateForm
}: FormOptions<T>) {
  const [values, setValues] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    // First check required fields
    if (!validateRequiredProps(values, requiredFields, formName)) {
      return false;
    }
    
    // Then run custom validation if provided
    if (validateForm) {
      const validationErrors = validateForm(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await onSubmit(values as T);
      
      if (onSuccess) {
        onSuccess(result);
      } else {
        toast.success(`${formName} submitted successfully`);
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      
      if (onError) {
        onError(error);
      } else {
        console.error(`${formName} submission error:`, error);
        toast.error(`Error: ${errorMessage}`);
      }
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues
  };
}
