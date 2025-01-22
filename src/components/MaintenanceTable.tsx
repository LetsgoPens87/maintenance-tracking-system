import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingFn,
  Column,
  Row,
} from '@tanstack/react-table';
import { MaintenanceRecord } from '../types/maintenance';

interface MaintenanceRecordProps {
  data: MaintenanceRecord[];
  equipmentList: { id: string; name: string }[];  // Add equipmentList as a prop
}

// Custom sorting function for equipment names
const createEquipmentSorting = (equipmentList: { id: string; name: string }[]): SortingFn<MaintenanceRecord> => {
  return (rowA: Row<MaintenanceRecord>, rowB: Row<MaintenanceRecord>, columnId: string) => {
    const equipmentIdA = rowA.getValue('equipmentId') as string;
    const equipmentIdB = rowB.getValue('equipmentId') as string;

    // Find equipment names based on their IDs
    const equipmentA = equipmentList.find(equipment => equipment.id === equipmentIdA)?.name || '';
    const equipmentB = equipmentList.find(equipment => equipment.id === equipmentIdB)?.name || '';

    return equipmentA.localeCompare(equipmentB); // Perform alphabetical comparison
  };
};

const MaintenanceRecordTable: React.FC<MaintenanceRecordProps> = ({ data, equipmentList }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'equipmentId',
        header: 'Equipment',
        cell: ({ row }: { row: Row<MaintenanceRecord> }) => {
          const equipmentId = row.getValue('equipmentId');
          const equipment = equipmentList.find((equipment) => equipment.id === equipmentId);
          return equipment ? equipment.name : 'Unknown';  // Display equipment name instead of id
        },
        enableSorting: true, // Enable sorting for this column
        sortingFn: createEquipmentSorting(equipmentList), // Localized creation of sorting function
      },
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'type',
        header: 'Type',
      },
      {
        accessorKey: 'technician',
        header: 'Technician',
        enableSorting: true,
        sortingFn: (rowA: Row<MaintenanceRecord>, rowB: Row<MaintenanceRecord>, columnId: string) => {
          const valueA = rowA.getValue(columnId) as string;
          const valueB = rowB.getValue(columnId) as string;
          return valueA.localeCompare(valueB); // Alphabetical comparison
        },
      },
      {
        accessorKey: 'hoursSpent',
        header: 'Hours Spent',
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'partsReplaced',
        header: 'Parts Replaced',
        cell: ({ row }: { row: Row<MaintenanceRecord> }) => {
          const parts: string[] = row.getValue('partsReplaced') || [];
          return parts.join(', ');
        },
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
      },
      {
        accessorKey: 'completionStatus',
        header: 'Completion Status',
      },
    ],
    [equipmentList]  // Add equipmentList as dependency for the columns memo
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc' && ' 🔼'}
                  {header.column.getIsSorted() === 'desc' && ' 🔽'}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceRecordTable;