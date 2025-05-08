
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
      
      // Create profile entry is now handled by the trigger function
      // But we still need to handle the company creation if user is registering as company
      if (data.user && is_company_account) {
        // Create a company and associate it with the user
        const companyName = `${values.first_name} ${values.last_name} Company`;
        console.log('Creating company:', companyName);
        
        // Create company record
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: companyName,
            user_id: data.user.id,
          })
          .select('id')
          .single();
        
        if (companyError) {
          console.error('Company creation error:', companyError);
          toast.error('Error al crear la empresa');
        } else if (companyData) {
          console.log('Company created with ID:', companyData.id);
          
          // Update the user's profile with the company ID
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ 
              company_id: companyData.id,
              user_subtype: 'company_admin'
            })
            .eq('id', data.user.id);
          
          if (updateProfileError) {
            console.error('Error updating profile with company ID:', updateProfileError);
            toast.error('Error al asociar el perfil con la empresa');
          } else {
            console.log('Profile updated with company ID');
            toast.success('Empresa creada exitosamente');
          }
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
