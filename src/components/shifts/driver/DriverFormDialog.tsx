
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, User } from 'lucide-react';
import { Driver } from '@/types';

interface DriverFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (driver: Omit<Driver, 'id'> | Driver) => void;
  driver?: Driver | null;
  title: string;
  description: string;
  submitLabel: string;
}

export function DriverFormDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  driver = null,
  title,
  description,
  submitLabel,
}: DriverFormDialogProps) {
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Set initial values if editing an existing driver
  useEffect(() => {
    if (driver) {
      setDriverName(driver.name);
      setDriverEmail(driver.email);
    } else {
      resetForm();
    }
  }, [driver, isOpen]);

  const resetForm = () => {
    setDriverName('');
    setDriverEmail('');
    setNameError('');
    setEmailError('');
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!driverName.trim()) {
      setNameError('El nombre es obligatorio');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!driverEmail.trim()) {
      setEmailError('El email es obligatorio');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(driverEmail)) {
      setEmailError('El email no es válido');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (driver) {
        onSubmit({
          ...driver,
          name: driverName.trim(),
          email: driverEmail.trim()
        });
      } else {
        onSubmit({
          name: driverName.trim(),
          email: driverEmail.trim()
        });
      }
      
      resetForm();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Nombre y apellidos"
                className="pl-10"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
            </div>
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@ibizatransfer.com"
                className="pl-10"
                value={driverEmail}
                onChange={(e) => setDriverEmail(e.target.value)}
              />
            </div>
            {emailError && <p className="text-xs text-destructive">{emailError}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
