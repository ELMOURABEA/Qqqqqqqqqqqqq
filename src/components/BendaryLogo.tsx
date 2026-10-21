import React from 'react';

interface BendaryLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  whiteTheme?: boolean;
}

export const BendaryLogo: React.FC<BendaryLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  whiteTheme = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Extracted Logo Image */}
      <div className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden bg-white shadow-md border border-slate-200/80 p-0.5 shrink-0 flex items-center justify-center`}>
        <img
          src="/bendary_logo.jpg"
          alt="لوجو صيدليات البنداري"
          className="w-full h-full object-contain"
          onError={(e) => {
            // Graceful fallback to SVG if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight leading-none ${whiteTheme ? 'text-white' : 'text-bendary-900'} ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-lg'}`}>
              صيدليات البنداري
            </span>
            <span className="bg-bendary-100 text-bendary-800 text-[10px] font-black px-1.5 py-0.2 rounded-md">
              46 سنة
            </span>
          </div>
          <span className={`text-[10px] font-extrabold tracking-wider uppercase mt-0.5 ${whiteTheme ? 'text-slate-300' : 'text-slate-500'}`}>
            EL-BENDARY PHARMACIES • SINCE 1980
          </span>
        </div>
      )}
    </div>
  );
};
