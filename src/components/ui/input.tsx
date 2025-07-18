'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeClosed } from 'lucide-react';
import React from 'react';

interface InputProps extends React.ComponentProps<'input'> {
  type?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

function Input({ className, leftIcon, rightIcon, type, ...props }: InputProps) {
  const [isPassword, setIsPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setIsPassword(!isPassword);
  };

  return (
    <div
      className={cn(
        'autofill-parent w-full flex gap-2.5 items-center file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-11 min-w-0 border-2 bg-transparent px-3 py-1 text-base font-bold shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
    >
      {leftIcon && <button>{leftIcon}</button>}
      <input
        type={type === 'password' && !isPassword ? 'password' : 'text'}
        className="input flex-1 h-full min-w-0 border-0 bg-transparent p-0 align-middle text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none disabled:opacity-50"
        {...props}
      />

      {type === 'password' && (
        <button
          type="button"
          className="cursor-pointer p-0"
          onClick={togglePasswordVisibility}
        >
          {isPassword ? <EyeClosed /> : <Eye />}
        </button>
      )}
      {rightIcon && <button>{rightIcon}</button>}
    </div>
  );
}

export { Input };
