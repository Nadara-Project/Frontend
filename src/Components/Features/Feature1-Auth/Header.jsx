import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center w-full text-center pt-[24px] mb-[32px]">
      
      {/* 1. حاوية اللوجو  */}
      <div className="h-[72px] py-[16px] flex items-center justify-center w-full">
        <img 
          src="/Logo.svg" 
          alt="نضارة - Nadara" 
          className="h-full w-auto object-contain" 
        />
      </div>

      {/* 2. العنوان الرئيسي  */}
      <h1 className="font-tajawal font-medium text-[24px] leading-[32px] tracking-normal text-center align-middle text-[#4C2325]">
        {title} 
      </h1>

      {/* 3. النص الفرعي  */}
      <p className="font-tajawal font-normal not-italic text-[16px] leading-[24px] tracking-normal text-center align-middle text-[#4C2325]">
        {subtitle} 
      </p>

    </div>
  );
};

export default Header;