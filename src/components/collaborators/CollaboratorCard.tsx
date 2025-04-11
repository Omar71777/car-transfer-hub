
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Users, TrendingUp } from 'lucide-react';

interface CollaboratorCardProps {
  name: string;
  transferCount: number;
  commissionTotal: number;
  averageCommission: number;
}

export function CollaboratorCard({ name, transferCount, commissionTotal, averageCommission }: CollaboratorCardProps) {
  return (
    <Card className="relative overflow-hidden h-full bg-gradient-to-br from-cyan-100/90 to-white">
      {/* Always visible shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/20 to-blue-100/0 animate-shine"></div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-primary">{name}</CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Transfers</span>
            <span className="font-medium">{transferCount}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Comisión Total</span>
            <span className="font-medium text-accent-foreground">{formatCurrency(commissionTotal)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Comisión Media</span>
            <span className="font-medium">{formatCurrency(averageCommission)}</span>
          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-sm font-medium">Comisión Media por Transfer</span>
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="font-bold">{formatCurrency(averageCommission)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <div className="h-2 w-full bg-gradient-to-r from-blue-400/20 via-blue-400/60 to-blue-400/20 absolute bottom-0 transition-all ease-in-out"></div>
    </Card>
  );
}
