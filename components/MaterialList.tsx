
import React from 'react';
import { Material } from '../types';

interface MaterialListProps {
  materials: Material[];
  onQuantityChange: (id: number, quantity: number) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({ materials, onQuantityChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md print-container">
      <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">รายการอุปกรณ์ไฟฟ้า</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 font-semibold text-slate-600">รายการ</th>
              <th className="p-3 font-semibold text-slate-600 text-right">ราคา/หน่วย (บาท)</th>
              <th className="p-3 font-semibold text-slate-600 text-center w-28">จำนวน</th>
              <th className="p-3 font-semibold text-slate-600 text-right">ราคารวม (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3">
                  <span className="font-medium text-slate-800">{material.name}</span>
                  <span className="text-sm text-slate-500 ml-2">({material.unit})</span>
                </td>
                <td className="p-3 text-right text-slate-600">{material.price.toFixed(2)}</td>
                <td className="p-3 text-center">
                  <input
                    type="number"
                    value={material.quantity || ''}
                    onChange={(e) => onQuantityChange(material.id, parseInt(e.target.value, 10) || 0)}
                    className="w-24 text-center p-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition no-print"
                    placeholder="0"
                    min="0"
                  />
                  <span className="hidden print:inline">{material.quantity}</span>
                </td>
                <td className="p-3 text-right font-semibold text-slate-800">
                  {(material.price * material.quantity).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialList;
