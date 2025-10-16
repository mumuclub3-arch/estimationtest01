
import React from 'react';
import { Material } from '../types';

interface QuoteSummaryProps {
  totalMaterialCost: number;
  totalLaborCost: number;
  vehicleCost: number;
  setVehicleCost: (cost: number) => void;
  subtotal: number;
  profitMargin: number;
  setProfitMargin: (margin: number) => void;
  profit: number;
  grandTotal: number;
  materials: Material[];
}

const SummaryRow: React.FC<{ label: string; value: string; isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
  <div className={`flex justify-between items-center py-2 ${isTotal ? 'text-lg font-bold border-t-2 border-slate-300 pt-3' : 'text-base'}`}>
    <span className={isTotal ? 'text-slate-800' : 'text-slate-600'}>{label}</span>
    <span className={isTotal ? 'text-blue-600' : 'text-slate-800 font-medium'}>{value}</span>
  </div>
);

const QuoteSummary: React.FC<QuoteSummaryProps> = ({
  totalMaterialCost,
  totalLaborCost,
  vehicleCost,
  setVehicleCost,
  subtotal,
  profitMargin,
  setProfitMargin,
  profit,
  grandTotal,
  materials
}) => {
  const formatCurrency = (value: number) => value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md print-container">
      <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">สรุปใบเสนอราคา</h2>
      
      <div className="space-y-2">
        <div className="print:hidden">
            <SummaryRow label="รวมค่าอุปกรณ์" value={`${formatCurrency(totalMaterialCost)} บาท`} />
            <SummaryRow label="รวมค่าแรง" value={`${formatCurrency(totalLaborCost)} บาท`} />
            <div className="flex justify-between items-center py-2">
                <label htmlFor="vehicle-cost" className="text-slate-600">ค่ารถยนต์ปฏิบัติงาน</label>
                <div className="relative w-32">
                    <input
                        id="vehicle-cost"
                        type="number"
                        value={vehicleCost || ''}
                        onChange={(e) => setVehicleCost(parseInt(e.target.value, 10) || 0)}
                        className="w-full p-1 text-right border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="0"
                        min="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">บาท</span>
                </div>
            </div>
            <SummaryRow label="ราคารวม (ก่อนกำไร)" value={`${formatCurrency(subtotal)} บาท`} />
        </div>

        {/* Print only summary */}
        <div className="hidden print:block mb-4">
             <h3 className="text-lg font-semibold mb-2">รายการสรุป</h3>
             {materials.map(m => (
                <div key={m.id} className="flex justify-between text-sm py-1 border-b border-dashed">
                    <span>{m.name} ({m.quantity} {m.unit})</span>
                    <span>{formatCurrency(m.quantity * m.price)}</span>
                </div>
             ))}
             <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                <span>รวมค่าอุปกรณ์</span>
                <span>{formatCurrency(totalMaterialCost)}</span>
            </div>
             <div className="flex justify-between font-semibold mt-1">
                <span>รวมค่าแรง</span>
                <span>{formatCurrency(totalLaborCost)}</span>
            </div>
            {vehicleCost > 0 && (
              <div className="flex justify-between font-semibold mt-1">
                  <span>ค่ารถยนต์ปฏิบัติงาน</span>
                  <span>{formatCurrency(vehicleCost)}</span>
              </div>
            )}
        </div>

        <div className="flex justify-between items-center py-2 border-t border-slate-200 no-print">
            <label htmlFor="profit-margin" className="text-slate-600">กำไร</label>
            <div className="relative w-28">
                <input
                    id="profit-margin"
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-1 text-right border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">%</span>
            </div>
        </div>
        <SummaryRow label={`กำไร (${profitMargin}%)`} value={`${formatCurrency(profit)} บาท`} />
        <SummaryRow label="ราคารวมทั้งสิ้น" value={`${formatCurrency(grandTotal)} บาท`} isTotal={true} />
      </div>
       <p className="text-xs text-slate-400 mt-4 text-center">
        * ราคาอุปกรณ์อ้างอิงจากร้านค้าใน จ.เชียงใหม่ และอาจมีการเปลี่ยนแปลง
      </p>
    </div>
  );
};

export default QuoteSummary;
