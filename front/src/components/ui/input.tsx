import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    children?: React.ReactNode;
    error?: string;
}

const Input = ({ label, id, className, children, error, ...rest }: InputProps) => {
    return (
        <div className="mb-4">
            <label
                htmlFor={id}
                className="block mb-2 text-sm font-medium text-gray-900"
            >
                {label}
            </label>
            <div className="flex items-center">
                <input
                    id={id}
                    className={clsx(
                        'border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10',
                        className,
                    )}
                    {...rest}
                />
                {children && (
                    <span
                        className="flex items-center px-3 rounded-r-lg bg-primary-500 text-white text-sm h-[42px] ml-[-8px] -mt-4"
                    >
                        {children}
                    </span>
                )}
            </div>
            {error && <span className="text-red-500">{error}</span>}
        </div>
    );
};

export default Input;