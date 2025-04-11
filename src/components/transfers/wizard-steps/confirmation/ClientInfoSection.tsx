
import React from 'react';

interface ClientInfoSectionProps {
  client: any;
}

export function ClientInfoSection({ client }: ClientInfoSectionProps) {
  if (!client) return null;
  
  return (
    <div>
      <h3 className="font-medium text-lg">Información del cliente</h3>
      <p>{client.name}</p>
      <p className="text-sm text-muted-foreground">{client.email}</p>
    </div>
  );
}
