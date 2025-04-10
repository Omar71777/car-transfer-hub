
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
    <Card className="glass-card shine-effect h-full">
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
            <span className="font-medium text-amber-500">{formatCurrency(commissionTotal)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Comisión Media</span>
            <span className="font-medium">{formatCurrency(averageCommission)}</span>
          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-sm font-medium">Comisión Media por Transfer</span>
            <div className="flex items-center gap-1 text-emerald-500">
              <TrendingUp className="h-4 w-4" />
              <span className="font-bold">{formatCurrency(averageCommission)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
