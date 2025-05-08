
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent, CardDescription } from '@/components/ui/card';
import { LoginForm, LoginFormValues } from './LoginForm';
import { RegisterForm, RegisterFormValues } from './RegisterForm';

interface AuthContentProps {
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  planParam: string | null;
  onLoginSubmit: (values: LoginFormValues) => Promise<void>;
  onRegisterSubmit: (values: RegisterFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const AuthContent = ({
  authMode,
  setAuthMode,
  planParam,
  onLoginSubmit,
  onRegisterSubmit,
  isSubmitting
}: AuthContentProps) => {
  return (
    <CardContent>
      <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm 
            onSubmit={onLoginSubmit}
            isSubmitting={isSubmitting}
          />
        </TabsContent>
        
        <TabsContent value="register">
          {planParam && (
            <div className="mt-2 mb-4 p-2 bg-primary/10 rounded-md">
              <p className="text-sm font-medium">
                Plan seleccionado: <span className="font-bold text-primary capitalize">{planParam}</span>
              </p>
            </div>
          )}
          <RegisterForm 
            onSubmit={onRegisterSubmit}
            isSubmitting={isSubmitting}
            selectedPlan={planParam}
          />
        </TabsContent>
      </Tabs>
    </CardContent>
  );
};
