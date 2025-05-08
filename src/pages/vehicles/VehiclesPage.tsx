
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useVehicles } from '@/hooks/useVehicles';
import { useCompanies } from '@/hooks/useCompanies';
import { VehiclesContent } from './components/VehiclesContent';
import { VehicleDialog } from './components/VehicleDialog';
import { Vehicle } from '@/types/vehicle';
import { toast } from 'sonner';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { useAuth } from '@/contexts/auth';

const VehiclesPage = () => {
  const { profile } = useAuth();
  const { vehicles, loading, fetchVehicles, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { companies, loading: loadingCompanies, fetchCompanies } = useCompanies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(profile?.company_id || null);

  useEffect(() => {
    fetchCompanies();
    if (profile?.company_id) {
      setSelectedCompanyId(profile.company_id);
      fetchVehicles(profile.company_id);
    } else if (companies.length > 0) {
      setSelectedCompanyId(companies[0].id);
      fetchVehicles(companies[0].id);
    }
  }, [profile, fetchCompanies, fetchVehicles, companies.length]);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    fetchVehicles(companyId);
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleVehicleSubmit = async (formData: any) => {
    try {
      let success;
      
      if (editingVehicle) {
        // Update existing vehicle
        success = await updateVehicle(editingVehicle.id, {
          ...formData,
          company_id: selectedCompanyId || formData.company_id
        });
      } else {
        // Create new vehicle
        const vehicleId = await createVehicle({
          ...formData,
          company_id: selectedCompanyId || formData.company_id
        });
        success = !!vehicleId;
      }
      
      if (success) {
        setIsDialogOpen(false);
        fetchVehicles(selectedCompanyId || undefined);
      }
    } catch (error) {
      console.error('Error submitting vehicle form:', error);
      toast.error('Error al guardar el vehículo');
    }
  };

  const handleConfirmDelete = async () => {
    if (vehicleToDelete) {
      const success = await deleteVehicle(vehicleToDelete.id, vehicleToDelete.company_id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setVehicleToDelete(null);
        fetchVehicles(selectedCompanyId || undefined);
      }
    }
  };

  return (
    <MainLayout>
      <MobileHeader title="Gestión de Vehículos" />
      
      <div className="py-6 px-4">
        <VehiclesContent 
          vehicles={vehicles}
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          onCompanyChange={handleCompanyChange}
          loading={loading}
          loadingCompanies={loadingCompanies}
          onAdd={handleAddVehicle}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
        />
      </div>

      <VehicleDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicle={editingVehicle}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onSubmit={handleVehicleSubmit}
      />

      {/* Delete Confirmation Dialog */}
      {/* You'll need to create a confirmation dialog component */}
    </MainLayout>
  );
};

export default VehiclesPage;
