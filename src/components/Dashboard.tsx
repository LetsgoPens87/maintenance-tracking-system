import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Equipment } from '../types/equipment';
import { MaintenanceRecord } from '../types/maintenance';

interface DashboardProps {
  equipmentData: Equipment[];
  maintenanceData: MaintenanceRecord[];
}

const COLORS = ['#4CAF50', '#F44336', '#FFEB3B', '#9C27B0']; // Green, Red, Yellow, Purple

const Dashboard: React.FC<DashboardProps> = ({ equipmentData, maintenanceData }) => {
  const statusData = useMemo(() => {
    const counts = equipmentData.reduce(
      (acc, equipment) => {
        acc[equipment.status] = (acc[equipment.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(counts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [equipmentData]);

  const hoursByDepartment = useMemo(() => {
    const departmentHours = maintenanceData.reduce((acc, record) => {
      const equipment = equipmentData.find((eq) => eq.id === record.equipmentId);
      if (equipment) {
        acc[equipment.department] = (acc[equipment.department] || 0) + record.hoursSpent;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentHours).map(([department, hours]) => ({
      department,
      hours,
    }));
  }, [maintenanceData, equipmentData]);

  const recentActivities = useMemo(
    () =>
      maintenanceData.slice(-5).map((record) => {
        const equipment = equipmentData.find((eq) => eq.id === record.equipmentId);
        return {
          id: record.id,
          equipmentName: equipment ? equipment.name : 'Unknown Equipment',
          date: new Date(record.date).toLocaleDateString(),
          description: record.description,
        };
      }),
    [maintenanceData, equipmentData]
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Dashboard</h2>

      {/* Equipment Status Breakdown - Pie Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Equipment Status Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Maintenance Hours by Department - Bar Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Maintenance Hours by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hoursByDepartment}>
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Maintenance Activities */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Maintenance Activities</h3>
        <ul>
          {recentActivities.map((activity) => (
            <li key={activity.id} className="mb-2 p-2 bg-gray-100 rounded shadow">
              <p className="font-bold">{activity.equipmentName}</p>
              <p>Date: {activity.date}</p>
              <p>Description: {activity.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;