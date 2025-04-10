
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Driver } from '@/types';
import { UserPlus, Pencil, Trash2, Mail, User } from 'lucide-react';

interface DriverManagementProps {
  drivers: Driver[];
  onAddDriver: (driver: Omit<Driver, 'id'>) => void;
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (id: string) => void;
}

export function DriverManagement({ drivers, onAddDriver, onUpdateDriver, onDeleteDriver }: DriverManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverEmail, setNewDriverEmail] = useState('');
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const resetForm = () => {
    setNewDriverName('');
    setNewDriverEmail('');
    setNameError('');
    setEmailError('');
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!newDriverName.trim()) {
      setNameError('El nombre es obligatorio');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!newDriverEmail.trim()) {
      setEmailError('El email es obligatorio');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newDriverEmail)) {
      setEmailError('El email no es válido');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };

  const handleAddSubmit = () => {
    if (validateForm()) {
      onAddDriver({
        name: newDriverName.trim(),
        email: newDriverEmail.trim()
      });
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditSubmit = () => {
    if (validateForm() && editingDriver) {
      onUpdateDriver({
        ...editingDriver,
        name: newDriverName.trim(),
        email: newDriverEmail.trim()
      });
      resetForm();
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (driver: Driver) => {
    setEditingDriver(driver);
    setNewDriverName(driver.name);
    setNewDriverEmail(driver.email);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestión de Conductores</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Añadir Conductor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Conductor</DialogTitle>
              <DialogDescription>
                Introduce los datos del nuevo conductor para poder asignarle turnos.
              </DialogDescription>
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
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
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
                    value={newDriverEmail}
                    onChange={(e) => setNewDriverEmail(e.target.value)}
                  />
                </div>
                {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleAddSubmit}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {drivers.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[100px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(driver)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará al conductor {driver.name} del sistema y no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDeleteDriver(driver.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center mb-4">No hay conductores registrados todavía.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Añadir Conductor
            </Button>
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Conductor</DialogTitle>
            <DialogDescription>
              Modifica los datos del conductor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-name"
                  placeholder="Nombre y apellidos"
                  className="pl-10"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                />
              </div>
              {nameError && <p className="text-xs text-destructive">{nameError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="example@ibizatransfer.com"
                  className="pl-10"
                  value={newDriverEmail}
                  onChange={(e) => setNewDriverEmail(e.target.value)}
                />
              </div>
              {emailError && <p className="text-xs text-destructive">{emailError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
