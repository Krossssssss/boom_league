import React from 'react';
import { LucideX } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { ModalProps } from '../../types';

const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => {
    const { theme } = useTheme();
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
            <div className={`relative ${theme === 'dark' ? 'bg-black/40' : 'bg-white/90'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-xl sm:rounded-2xl md:rounded-3xl ${theme === 'dark' ? 'shadow-[0_0_80px_rgba(0,0,0,0.5)]' : 'shadow-[0_0_80px_rgba(0,0,0,0.2)]'} p-5 sm:p-7 md:p-8 lg:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl animate-in fade-in zoom-in duration-200 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto`}>
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'} rounded-lg sm:rounded-xl`}></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start gap-4 sm:gap-5 mb-5 sm:mb-7 md:mb-8">
                        <h3 className={`text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight flex-1 ${theme === 'dark' ? 'bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                            {title}
                        </h3>
                        <button 
                            onClick={onClose} 
                            className={`min-h-touch min-w-touch p-3 sm:p-3.5 rounded-xl transition-all duration-200 border border-transparent flex-shrink-0 active:scale-95 ${theme === 'dark' ? 'text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'}`}
                        >
                            <LucideX size={20} />
                        </button>
                    </div>
                    <div className="space-y-5 sm:space-y-6 md:space-y-7">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
