
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 bg-white rounded-lg shadow-md print-container">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
        โปรแกรมคำนวณราคาค่าติดตั้งระบบไฟฟ้า
      </h1>
      <p className="text-md text-slate-600 mt-1">
        คิดค้นจากพี่บี อภิวัฒน์
      </p>
    </header>
  );
};

export default Header;
