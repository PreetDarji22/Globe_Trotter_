import React from 'react';

interface StickerCardProps {
  colorClass: string;
  rotation?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const StickerCard: React.FC<StickerCardProps> = ({ 
  colorClass, 
  rotation = '-rotate-1', 
  icon, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${colorClass} rounded-2xl p-6 shadow-sm transform transition-transform hover:scale-[1.02] hover:shadow-md hover:z-10 ${rotation} ${className}`}>
      {icon && (
        <div className="absolute -top-4 -right-4 bg-white text-slate-800 p-2.5 rounded-full shadow-sticker border-[3px] border-white rotate-12 z-20 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
