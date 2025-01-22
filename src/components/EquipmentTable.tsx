import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingFn,
} from '@tanstack/react-table';
import { Equipment } from '../types/equipment';

interface EquipmentTableProps {
  data: Equipment[];
}

// Define the custom sorting function
const myCustomSorting: SortingFn<Equipment> = (rowA, rowB, columnId) => {
  const valueA = rowA.getValue(columnId) as string;
  const valueB = rowB.getValue(columnId) as string;

  return valueA.localeCompare(valueB); // Alphabetical comparison
};

const EquipmentTable: React.FC<EquipmentTableProps> = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Equipment ID',
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true, // Enable sorting
        sortingFn: myCustomSorting, // Use the custom sorting function
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
      {
        accessorKey: 'department',
        header: 'Department',
      },
      {
        accessorKey: 'model',
        header: 'Model',
      },
      {
        accessorKey: 'serialNumber',
        header: 'Serial Number',
      },
      {
        accessorKey: 'installDate',
        header: 'Install Date',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    sortingFns: {
      myCustomSorting, // Register the custom sorting function here
    },
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
        <td
          key={cell.id}
          className={`border border-gray-300 px-4 py-2 ${
            cell.column.id === 'status'
              ? cell.getValue() === 'Operational'
                ? 'bg-green-400'
                : cell.getValue() === 'Down'
                ? 'bg-red-400'
                : cell.getValue() === 'Maintenance'
                ? 'bg-yellow-400'
                : cell.getValue() === 'Retired'
                ? 'bg-purple-400'
                : ''
              : ''
          }`}
        >
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

export default EquipmentTable;