import React from 'react';

interface SuperFriedLogoProps {
  className?: string;
  size?: number;
}

export const SuperFriedLogo: React.FC<SuperFriedLogoProps> = ({
  className = '',
  size = 48,
}) => {
  const scale = size / 48;

  return (
    <div
      className={`relative select-none inline-flex flex-col items-center justify-end shrink-0 ${className}`}
      style={{
        width: 44 * scale,
        height: 52 * scale,
      }}
    >
      {/* Container box with fries */}
      <div 
        className="relative w-full h-[78%] bg-gradient-to-br from-[#FF5722] via-[#F4511E] to-[#E64A19] rounded-b-xl shadow-lg flex flex-col items-center justify-end overflow-visible border border-[#FF7043]/30"
      >
        {/* Fries shapes projecting from the top */}
        <div className="absolute -top-3.5 inset-x-0 flex justify-center items-end gap-[2px] pointer-events-none">
          <div className="w-1.5 h-5 bg-[#FFC107] rounded-t-xs -rotate-12 shadow-xs" />
          <div className="w-2 h-7 bg-[#FFD54F] rounded-t-xs -rotate-3 shadow-xs" />
          <div className="w-1.5 h-6 bg-[#FFC107] rounded-t-xs shadow-xs" />
          <div className="w-2 h-7.5 bg-[#FFE082] rounded-t-xs rotate-6 shadow-xs" />
          <div className="w-1.5 h-5.5 bg-[#FFC107] rounded-t-xs rotate-12 shadow-xs" />
        </div>

        {/* Box Text */}
        <div className="text-white font-black text-[9px] uppercase tracking-tighter text-center leading-[1.05] z-10 pb-1 px-0.5">
          SUPER<br />
          <span className="text-[#FFD54F]">FRIED</span>
        </div>
      </div>
    </div>
  );
};
