import React from 'react';

const SecondaryButton = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-[8px] bg-[#FDFBF7] text-[#D5C7AD] border-2 border-[#D5C7AD] rounded-[8px] px-[24px] py-[12px] font-medium transition-all duration-200 hover:bg-[#FBF9F2] active:scale-95 ${className}`}
      
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
