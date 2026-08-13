import React from 'react';

const Button = ({ children, onClick, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-[8px] bg-[#3F4C3A] text-white rounded-[8px] px-[24px] py-[12px] font-medium transition-all duration-200 hover:opacity-90 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;