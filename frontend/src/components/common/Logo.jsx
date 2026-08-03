import React from 'react';

export const Logo = ({ size = 'normal', showSubtitle = true }) => {
  const isSmall = size === 'small';

  return (
    <div className="flex items-center gap-3">
      {/* Flat Geometric 'M' with Integrated Medical Cross */}
      <div className={`shrink-0 flex items-center justify-center bg-[#0F4C81] text-white rounded font-bold relative ${isSmall ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'}`}>
        <svg className={isSmall ? 'w-5 h-5' : 'w-6 h-6'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Geometric M strokes */}
          <path d="M4 19V5L12 13L20 5V19" stroke="white" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/>
          {/* Subtle medical cross overlay */}
          <path d="M12 9V17" stroke="#007C91" strokeWidth="2" strokeLinecap="square"/>
          <path d="M8 13H16" stroke="#007C91" strokeWidth="2" strokeLinecap="square"/>
        </svg>
      </div>

      <div>
        <div className={`font-extrabold tracking-tight text-slate-900 leading-none ${isSmall ? 'text-sm' : 'text-base'}`}>
          <span className="text-[#0F4C81]">MEDI</span>
          <span className="text-[#007C91]">NEX</span>
        </div>
        {showSubtitle && (
          <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
            Enterprise HIS
          </div>
        )}
      </div>
    </div>
  );
};
