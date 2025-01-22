"use client";

import React, { useState } from 'react';
import EquipmentForm from '../components/EquipmentForm';
import EquipmentTable from '../components/EquipmentTable';
import MaintenanceForm from '../components/MaintenanceForm';
import MaintenanceTable from '../components/MaintenanceTable';
import Dashboard from '../components/Dashboard';
import { Equipment } from '../types/equipment';
import { MaintenanceRecord } from '../types/maintenance';

const Page: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('equipmentForm');
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);

  const handleAddEquipment = (newEquipment: Equipment) => {
    setEquipments((prevEquipments) => [...prevEquipments, newEquipment]);
    setActiveComponent('equipmentTable');
  };

  const handleAddMaintenance = (newMaintenance: MaintenanceRecord) => {
    setMaintenances((prevMaintenances) => [...prevMaintenances, newMaintenance]);
    setActiveComponent('maintenanceTable');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl text-center font-bold mb-4">Equipment Management Dashboard</h2>
      <div className="mb-10 flex justify-center">
        {/* Buttons for navigation */}
        <button
          onClick={() => setActiveComponent('equipmentForm')}
          className="mr-2 p-2 bg-blue-600 text-white rounded"
        >
          Equipment Form
        </button>
        <button
          onClick={() => setActiveComponent('equipmentTable')}
          className="mr-2 p-2 bg-blue-600 text-white rounded"
        >
          Equipment Table
        </button>
        <button
          onClick={() => setActiveComponent('maintenanceForm')}
          className="mr-2 p-2 bg-blue-600 text-white rounded"
        >
          Maintenance Record Form
        </button>
        <button
          onClick={() => setActiveComponent('maintenanceTable')}
          className="mr-2 p-2 bg-blue-600 text-white rounded"
        >
          Maintenance Records Table
        </button>
        <button
          onClick={() => setActiveComponent('dashboard')}
          className="mr-2 p-2 bg-blue-600 text-white rounded"
        >
          Dashboard
        </button>
      </div>

      {/* Render components based on the activeComponent */}
      {activeComponent === 'equipmentForm' && (
        <div>
          <h2 className="text-xl font-bold text-center mb-4">Add New Equipment</h2>
          <EquipmentForm onAdd={handleAddEquipment} />
        </div>
      )}

      {activeComponent === 'equipmentTable' && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Equipment List</h2>
          <EquipmentTable data={equipments} />
        </div>
      )}

      {activeComponent === 'maintenanceForm' && (
        <div>
          <h2 className="text-xl font-bold text-center mb-4">Add New Maintenance Record</h2>
          <MaintenanceForm
            onAdd={handleAddMaintenance}
            equipmentList={equipments} // Pass equipment list to the maintenance form
          />
        </div>
      )}

      {activeComponent === 'maintenanceTable' && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Maintenance Records List</h2>
          <MaintenanceTable data={maintenances} equipmentList={equipments} />
        </div>
      )}

      {/* Dashboard */}
      {activeComponent === 'dashboard' && (
        <div>
          <Dashboard equipmentData={equipments} maintenanceData={maintenances} />
        </div>
      )}
    </div>
  );
};

export default Page;