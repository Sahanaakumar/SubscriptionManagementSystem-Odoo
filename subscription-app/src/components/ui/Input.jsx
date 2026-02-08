import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-0.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    className={cn(
                        'block w-full rounded-lg border-gray-300 shadow-sm text-gray-900 placeholder:text-gray-400',
                        'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out',
                        'py-2.5 px-3.5 sm:text-sm sm:leading-6',
                        error && 'border-blue-300 text-blue-900 placeholder-red-300 focus:ring-blue-500 focus:border-blue-500',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-blue-600 animate-slide-up">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
