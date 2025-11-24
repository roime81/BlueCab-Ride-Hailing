import React from 'react';
import { 
  MapPin, User, Search, Navigation, CreditCard, Star, 
  Menu, Clock, ShieldCheck, ChevronRight, Phone, MessageSquare,
  ArrowLeft, CheckCircle, Car, DollarSign
} from 'lucide-react';

// --- Icons Wrapper ---
export const Icons = {
  MapPin, User, Search, Navigation, CreditCard, Star, 
  Menu, Clock, ShieldCheck, ChevronRight, Phone, MessageSquare,
  ArrowLeft, CheckCircle, Car, DollarSign
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', fullWidth = false, className = '', ...props 
}) => {
  const baseStyle = "py-3 px-6 rounded-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#1A4DBE] text-white shadow-lg shadow-blue-900/20 hover:bg-[#153e99]",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border-2 border-[#1A4DBE] text-[#1A4DBE] hover:bg-blue-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-50"
  };
  
  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ icon, className = '', ...props }) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input 
        className={`w-full bg-gray-50 border border-gray-100 text-gray-800 rounded-2xl py-3.5 ${icon ? 'pl-11' : 'pl-4'} pr-4 focus:outline-none focus:ring-2 focus:ring-[#1A4DBE]/20 focus:border-[#1A4DBE] transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ 
  children, className = '', onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 ${className}`}
    >
      {children}
    </div>
  );
};

// --- Bottom Sheet ---
export const BottomSheet: React.FC<{ 
  children: React.ReactNode; 
  isOpen?: boolean;
  className?: string;
}> = ({ children, isOpen = true, className = '' }) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 z-50 overflow-hidden ${isOpen ? 'translate-y-0' : 'translate-y-full'} ${className}`}>
      <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-2" />
      <div className="p-6 pt-2 pb-8 max-h-[85vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

// --- Header ---
export const Header: React.FC<{ 
  title?: string; 
  onBack?: () => void;
  rightAction?: React.ReactNode;
}> = ({ title, onBack, rightAction }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 px-4 pt-12 pb-4 flex items-center justify-between bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
      <div className="pointer-events-auto">
        {onBack && (
          <button onClick={onBack} className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-50">
            <Icons.ArrowLeft size={20} />
          </button>
        )}
      </div>
      {title && <h1 className="text-lg font-bold text-gray-800 drop-shadow-sm">{title}</h1>}
      <div className="pointer-events-auto">
        {rightAction || <div className="w-10" />}
      </div>
    </div>
  );
};
