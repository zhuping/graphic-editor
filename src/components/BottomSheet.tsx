// src/components/BottomSheet.tsx
import React, { useState, useEffect, useRef } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const [animation, setAnimation] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');
  const sheetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && animation === 'exited') {
      setAnimation('entering');
      setTimeout(() => setAnimation('entered'), 10);
    } else if (!isOpen && animation === 'entered') {
      setAnimation('exiting');
      setTimeout(() => setAnimation('exited'), 300); // Match transition duration
    }
  }, [isOpen, animation]);
  
  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && 
          !sheetRef.current.contains(event.target as Node) && 
          animation === 'entered') {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, animation]);
  
  if (animation === 'exited' && !isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          animation === 'entered' ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Sheet Content */}
      <div 
        ref={sheetRef}
        className={`relative w-full max-w-md bg-white rounded-t-lg shadow-lg transform transition-transform duration-300 max-h-[80vh] overflow-auto ${
          animation === 'entered' ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="w-full flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="px-4 py-2 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}