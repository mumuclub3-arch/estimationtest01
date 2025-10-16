import React, { useState, useMemo, useCallback } from 'react';
import { Material } from './types';
import { INITIAL_MATERIALS } from './constants';
import Header from './components/Header';
import MaterialList from './components/MaterialList';
import LaborCalculator from './components/LaborCalculator';
import QuoteSummary from './components/QuoteSummary';
import { ResetIcon, PrintIcon } from './components/icons/Icons';

// TypeScript declarations for libraries loaded via script tags
declare const html2canvas: any;
declare const jspdf: any;


const App: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [electricianDays, setElectricianDays] = useState<number>(1);
  const [helperDays, setHelperDays] = useState<number>(1);
  const [electricianWage, setElectricianWage] = useState<number>(700);
  const [helperWage, setHelperWage] = useState<number>(450);
  const [profitMargin, setProfitMargin] = useState<number>(15);
  const [vehicleCost, setVehicleCost] = useState<number>(0);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);


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

  const subtotal = useMemo(() => totalMaterialCost + totalLaborCost + vehicleCost, [totalMaterialCost, totalLaborCost, vehicleCost]);
  const profit = useMemo(() => subtotal * (profitMargin / 100), [subtotal, profitMargin]);
  const grandTotal = useMemo(() => subtotal + profit, [subtotal, profit]);
  
  const handleReset = useCallback(() => {
    setMaterials(INITIAL_MATERIALS);
    setElectricianDays(1);
    setHelperDays(1);
    setElectricianWage(700);
    setHelperWage(450);
    setProfitMargin(15);
    setVehicleCost(0);
  }, []);

  const handlePrint = useCallback(() => {
    const { jsPDF } = jspdf;
    const printElement = document.getElementById('printable-area');
    if (!printElement || isPrinting) return;

    setIsPrinting(true);
    document.body.classList.add('is-printing');

    html2canvas(printElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.width / canvas.height;
        const imgHeight = pdfWidth / canvasAspectRatio;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save('ใบเสนอราคา.pdf');
    }).catch(err => {
        console.error("PDF generation failed:", err);
        alert("ขออภัย, ไม่สามารถสร้างไฟล์ PDF ได้ โปรดลองใช้ฟังก์ชันพิมพ์ของเบราว์เซอร์แทน");
    }).finally(() => {
        document.body.classList.remove('is-printing');
        setIsPrinting(false);
    });
  }, [isPrinting]);

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div id="printable-area" className="max-w-7xl mx-auto space-y-8">
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
                  vehicleCost={vehicleCost}
                  setVehicleCost={setVehicleCost}
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
                        disabled={isPrinting}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-wait"
                    >
                        {isPrinting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังสร้าง PDF...
                            </>
                        ) : (
                            <>
                                <PrintIcon />
                                พิมพ์ใบเสนอราคา
                            </>
                        )}
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