
import React from 'react';

interface LaborCalculatorProps {
  electricianDays: number;
  setElectricianDays: (days: number) => void;
  helperDays: number;
  setHelperDays: (days: number) => void;
  electricianWage: number;
  setElectricianWage: (wage: number) => void;
  helperWage: number;
  setHelperWage: (wage: number) => void;
}

const LaborInput: React.FC<{ label: string; value: number; onChange: (value: number) => void; unit: string; }> = ({ label, value, onChange, unit }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-slate-600 mb-1">{label}</label>
        <div className="relative">
            <input
                type="number"
                value={value || ''}
                onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                min="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{unit}</span>
        </div>
    </div>
);

const LaborCalculator: React.FC<LaborCalculatorProps> = (props) => {
  const {
    electricianDays, setElectricianDays, helperDays, setHelperDays,
    electricianWage, setElectricianWage, helperWage, setHelperWage
  } = props;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md no-print print-container">
      <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">คำนวณค่าแรง</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <LaborInput label="จำนวนวัน (ช่างไฟ)" value={electricianDays} onChange={setElectricianDays} unit="วัน" />
        <LaborInput label="ค่าแรงช่างไฟ/วัน" value={electricianWage} onChange={setElectricianWage} unit="บาท" />
        <LaborInput label="จำนวนวัน (ผู้ช่วย)" value={helperDays} onChange={setHelperDays} unit="วัน" />
        <LaborInput label="ค่าแรงผู้ช่วย/วัน" value={helperWage} onChange={setHelperWage} unit="บาท" />
      </div>
    </div>
  );
};

export default LaborCalculator;
