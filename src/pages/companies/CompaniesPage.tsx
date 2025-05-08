
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCompanies } from '@/hooks/useCompanies';
import { CompaniesContent } from './components/CompaniesContent';
import { CompanyDialog } from './components/CompanyDialog';
import { Company } from '@/types/company';
import { toast } from 'sonner';
import { MobileHeader } from '@/components/layout/MobileHeader';

const CompaniesPage = () => {
  const { companies, loading, fetchCompanies, createCompany, updateCompany, deleteCompany } = useCompanies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsDialogOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsDialogOpen(true);
  };

  const handleDeleteCompany = (company: Company) => {
    setCompanyToDelete(company);
    setIsDeleteDialogOpen(true);
  };

  const handleCompanySubmit = async (formData: any) => {
    try {
      let success;
      
      if (editingCompany) {
        // Update existing company
        success = await updateCompany(editingCompany.id, formData);
      } else {
        // Create new company
        const companyId = await createCompany(formData);
        success = !!companyId;
      }
      
      if (success) {
        setIsDialogOpen(false);
        fetchCompanies();
      }
    } catch (error) {
      console.error('Error submitting company form:', error);
      toast.error('Error al guardar la empresa');
    }
  };

  const handleConfirmDelete = async () => {
    if (companyToDelete) {
      const success = await deleteCompany(companyToDelete.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setCompanyToDelete(null);
        fetchCompanies();
      }
    }
  };

  return (
    <MainLayout>
      <MobileHeader title="Gestión de Empresas" />
      
      <div className="py-6 px-4">
        <CompaniesContent 
          companies={companies}
          loading={loading}
          onAdd={handleAddCompany}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
        />
      </div>

      <CompanyDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        company={editingCompany}
        onSubmit={handleCompanySubmit}
      />

      {/* Delete Confirmation Dialog */}
      {/* You'll need to create a confirmation dialog component */}
    </MainLayout>
  );
};

export default CompaniesPage;
