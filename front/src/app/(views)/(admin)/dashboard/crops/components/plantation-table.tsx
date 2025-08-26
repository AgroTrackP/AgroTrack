'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';

export type Plantation = {
  id: string;
  name: string;
  ownerName: string;
  area_m2: number;
  crop_type: string;
  startDate: string;
};

interface PlantationsTableProps {
  plantations: Plantation[];
  onSort: (key: keyof Plantation) => void;
  sortConfig: { key: keyof Plantation; direction: 'ascending' | 'descending' } | null;
}

export function PlantationsTable({ plantations, onSort, sortConfig }: PlantationsTableProps) {
  const renderSortIcon = (key: keyof Plantation) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button className="flex items-center" onClick={() => onSort('name')}>Nombre Terreno {renderSortIcon('name')}</button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button className="flex items-center" onClick={() => onSort('ownerName')}>Propietario {renderSortIcon('ownerName')}</button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button className="flex items-center" onClick={() => onSort('crop_type')}>Cultivo {renderSortIcon('crop_type')}</button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button className="flex items-center" onClick={() => onSort('area_m2')}>Área (m²) {renderSortIcon('area_m2')}</button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button className="flex items-center" onClick={() => onSort('startDate')}>Fecha Inicio {renderSortIcon('startDate')}</button>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {plantations.map((p) => (
            <tr key={p.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.ownerName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.crop_type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.area_m2.toLocaleString('es-AR')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.startDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}