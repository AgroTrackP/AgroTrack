'use client';

import { ArrowDown, ArrowUp, Pencil, Lightbulb } from 'lucide-react';
import { PlantationStatusToggle } from './plantation-status-toggle';

export type Plantation = {
  id: string;
  name: string;
  ownerName: string;
  area_m2: number;
  crop_type: string;
  startDate: string;
  isActive: boolean;
};

interface PlantationsTableProps {
  plantations: Plantation[];
  onSort: (key: keyof Plantation) => void;
  sortConfig: { key: keyof Plantation; direction: 'ascending' | 'descending' } | null;
  onEdit: (plantation: Plantation) => void;
  onStatusChange: (plantationId: string, newStatus: boolean) => void;
  onViewRecs: (plantation: Plantation) => void;
}

export function PlantationsTable({ plantations, onSort, sortConfig, onEdit, onStatusChange, onViewRecs }: PlantationsTableProps) {
  
  const renderSortIcon = (key: keyof Plantation) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left">
              <button className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => onSort('name')}>
                Nombre Terreno {renderSortIcon('name')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <button className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => onSort('ownerName')}>
                Propietario {renderSortIcon('ownerName')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <button className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => onSort('crop_type')}>
                Cultivo {renderSortIcon('crop_type')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <button className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => onSort('startDate')}>
                Fecha Inicio {renderSortIcon('startDate')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {plantations.map((p) => (
            <tr key={p.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.ownerName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.crop_type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.startDate}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PlantationStatusToggle 
                  plantationId={p.id}
                  initialStatus={p.isActive}
                  onStatusChange={onStatusChange}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4">
                  <button onClick={() => onViewRecs(p)} className="text-yellow-500 hover:text-yellow-700" title="Ver Recomendaciones">
                    <Lightbulb size={18} />
                  </button>
                  <button onClick={() => onEdit(p)} className="text-indigo-600 hover:text-indigo-900" title="Editar Terreno">
                    <Pencil size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}