
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthForms } from '@/hooks/auth/useAuthForms';
import { AuthContent } from '@/components/auth/AuthContent';

export default function AuthPage() {
  const {
    authMode,
    setAuthMode,
    isSubmitting,
    session,
    isLoading,
    planParam,
    onLoginSubmit,
    onRegisterSubmit
  } = useAuthForms();
  
  // Redirect if already logged in
  if (!isLoading && session) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-blue-50 p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">CTHub</CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            {authMode === 'login' ? 'Ingresa a tu cuenta' : 'Crea una nueva cuenta'}
          </p>
        </CardHeader>
        
        <AuthContent
          authMode={authMode}
          setAuthMode={setAuthMode}
          planParam={planParam}
          onLoginSubmit={onLoginSubmit}
          onRegisterSubmit={onRegisterSubmit}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}
