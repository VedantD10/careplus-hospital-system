import React from 'react';

export const Logo = ({ size = 'normal', showSubtitle = true }) => {
  const isSmall = size === 'small';

  return (
    <div className="flex items-center gap-3">
      {/* Flat Geometric 'C' with Integrated Medical Cross */}
      <div className={`shrink-0 flex items-center justify-center bg-[#0F4C81] text-white rounded-lg font-bold relative ${isSmall ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'}`}>
        <svg className={isSmall ? 'w-5 h-5' : 'w-6 h-6'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Geometric C curve */}
          <path d="M17 8C15.5 6.5 13.5 6 11.5 6C7.5 6 5 9 5 12C5 15 7.5 18 11.5 18C13.5 18 15.5 17.5 17 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Subtle medical cross overlay */}
          <path d="M12 9V15" stroke="#007C91" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 12H15" stroke="#007C91" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div>
        <div className={`font-extrabold tracking-tight text-white leading-none ${isSmall ? 'text-sm' : 'text-base'}`}>
          <span className="text-[#0F4C81]">CARE</span>
          <span className="text-[#007C91]">PLUS</span>
        </div>
        {showSubtitle && (
          <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
            Enterprise HIS
          </div>
        )}
      </div>
    </div>
  );
};
