
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Client } from '@/types/client';
import { MoreVertical, Mail, Phone, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ClientCardViewProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientCardView({
  clients,
  onEdit,
  onDelete
}: ClientCardViewProps) {
  if (clients.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No hay clientes para mostrar</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <Card 
          key={client.id} 
          className="overflow-hidden transition-all hover:border-primary/40"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col">
                <span className="font-medium">{client.name}</span>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(client)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive" 
                      onClick={() => onDelete(client)}
                    >
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              
              {client.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              )}
              
              {client.tax_id && (
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.tax_id}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
