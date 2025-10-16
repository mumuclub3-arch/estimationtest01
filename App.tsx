
import React, { useState, useMemo, useCallback } from 'react';
import { Material } from './types';
import { INITIAL_MATERIALS } from './constants';
import Header from './components/Header';
import MaterialList from './components/MaterialList';
import LaborCalculator from './components/LaborCalculator';
import QuoteSummary from './components/QuoteSummary';
import { ResetIcon, PrintIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [electricianDays, setElectricianDays] = useState<number>(1);
  const [helperDays, setHelperDays] = useState<number>(1);
  const [electricianWage, setElectricianWage] = useState<number>(700);
  const [helperWage, setHelperWage] = useState<number>(450);
  const [profitMargin, setProfitMargin] = useState<number>(15);

  const handleQuantityChange = useCallback((id: number, quantity: number) => {
    setMaterials(prevMaterials =>
      prevMaterials.map(material =>
        material.id === id ? { ...material, quantity: quantity >= 0 ? quantity : 0 } : material
      )
    );
  }, []);

  const totalMaterialCost = useMemo(() => {
    return materials.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [materials]);

  const totalLaborCost = useMemo(() => {
    const electricianCost = electricianDays * electricianWage;
    const helperCost = helperDays * helperWage;
    return electricianCost + helperCost;
  }, [electricianDays, electricianWage, helperDays, helperWage]);

  const subtotal = useMemo(() => totalMaterialCost + totalLaborCost, [totalMaterialCost, totalLaborCost]);
  const profit = useMemo(() => subtotal * (profitMargin / 100), [subtotal, profitMargin]);
  const grandTotal = useMemo(() => subtotal + profit, [subtotal, profit]);
  
  const handleReset = useCallback(() => {
    setMaterials(INITIAL_MATERIALS);
    setElectricianDays(1);
    setHelperDays(1);
    setElectricianWage(700);
    setHelperWage(450);
    setProfitMargin(15);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <MaterialList materials={materials} onQuantityChange={handleQuantityChange} />
            <LaborCalculator
              electricianDays={electricianDays}
              setElectricianDays={setElectricianDays}
              helperDays={helperDays}
              setHelperDays={setHelperDays}
              electricianWage={electricianWage}
              setElectricianWage={setElectricianWage}
              helperWage={helperWage}
              setHelperWage={setHelperWage}
            />
          </div>
          
          <div className="lg:col-span-1">
             <div className="sticky top-8">
                <QuoteSummary
                  totalMaterialCost={totalMaterialCost}
                  totalLaborCost={totalLaborCost}
                  subtotal={subtotal}
                  profitMargin={profitMargin}
                  setProfitMargin={setProfitMargin}
                  profit={profit}
                  grandTotal={grandTotal}
                  materials={materials.filter(m => m.quantity > 0)}
                />
                 <div className="mt-6 flex justify-end gap-4 no-print">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors duration-200"
                    >
                        <ResetIcon />
                        ล้างข้อมูล
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
                    >
                        <PrintIcon />
                        พิมพ์ใบเสนอราคา
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
