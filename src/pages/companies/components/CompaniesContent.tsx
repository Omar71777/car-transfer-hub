
import React from 'react';
import { Company } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Plus, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface CompaniesContentProps {
  companies: Company[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export const CompaniesContent: React.FC<CompaniesContentProps> = ({
  companies,
  loading,
  onAdd,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
        <span className="ml-2">Cargando empresas...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Empresas</h1>
          <p className="text-muted-foreground">Gestione las empresas de su flota</p>
        </div>
        <Button onClick={onAdd} className="mobile-btn">
          <Plus className="w-4 h-4 mr-2" /> Crear Empresa
        </Button>
      </div>

      {companies.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No hay empresas</h3>
              <p className="text-muted-foreground mb-4">Para comenzar, cree una empresa usando el botón de arriba.</p>
              <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-2" /> Crear Empresa
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(company => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              onEdit={() => onEdit(company)}
              onDelete={() => onDelete(company)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CompanyCardProps {
  company: Company;
  onEdit: () => void;
  onDelete: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{company.name}</CardTitle>
        {company.address && <CardDescription>{company.address}</CardDescription>}
      </CardHeader>
      <CardContent>
        {company.tax_id && <p className="text-sm">ID Fiscal: {company.tax_id}</p>}
        {company.email && <p className="text-sm">Email: {company.email}</p>}
        {company.phone && <p className="text-sm">Teléfono: {company.phone}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};
