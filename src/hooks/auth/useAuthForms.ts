
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { LoginFormValues } from '@/components/auth/LoginForm';
import { RegisterFormValues } from '@/components/auth/RegisterForm';

export const useAuthForms = () => {
  const { signIn, session, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const planParam = searchParams.get('plan');
  const [authMode, setAuthMode] = useState<'login' | 'register'>(
    tabParam === 'register' ? 'register' : 'login'
  );
  
  // Set up plan metadata when registration form is initialized
  useEffect(() => {
    if (planParam) {
      console.log('Selected plan:', planParam);
      // Could store this in form or context to use later in the registration flow
    }
  }, [planParam]);
  
  async function onLoginSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  async function onRegisterSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);
    try {
      // Process the form values
      const { is_company_account, user_subtype, ...userData } = values;
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
            selected_plan: planParam,
            user_subtype: values.user_subtype || 'standard', // Store user_subtype in metadata
          },
        },
      });
      
      if (error) throw error;
      
      // Create company using SECURITY DEFINER function (bypasses RLS)
      if (data.user && is_company_account) {
        const companyName = `${values.first_name} ${values.last_name} Company`;
        console.log('Creating company via DB function:', companyName);
        
        const { data: companyResult, error: companyError } = await supabase
          .rpc('create_company_for_user', {
            _user_id: data.user.id,
            _company_name: companyName
          });
        
        if (companyError) {
          console.error('Company creation error:', companyError);
          toast.error('Error al crear la empresa');
        } else {
          console.log('Company created with ID:', companyResult);
          toast.success('Empresa creada exitosamente');
        }
      }
      
      toast.success('Registro exitoso. Por favor verifica tu email.');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return {
    authMode,
    setAuthMode,
    isSubmitting,
    session,
    isLoading,
    planParam,
    onLoginSubmit,
    onRegisterSubmit
  };
};
