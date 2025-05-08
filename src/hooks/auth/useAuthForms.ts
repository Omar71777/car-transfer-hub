
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
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
            selected_plan: planParam, // Store the selected plan from URL params
          },
        },
      });
      
      if (error) throw error;
      
      // Create profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            role: 'user', // Default role
          });
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error('Error al crear el perfil');
        } else {
          toast.success('Registro exitoso. Por favor verifica tu email.');
        }
      }
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
