import React, { FC } from "react";
import cs from "classnames"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    variant?: "primary" | "secondary" | "tertiary" | "outline";
}

const Button: FC<ButtonProps> = ({
    label = "soy un boton",
    variant = "primary",
    className,
    ...props }) => {
    const buttonVariants = {
        primary: "text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2",
        secondary: "text-white bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2",
        tertiary: "text-green-500",
        outline: "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
    }
    return (
        <button {...props}
            className={cs(
                buttonVariants[variant] || buttonVariants.primary,
                "disable:cursor-not-allowed ",
                className
            )}
        >
            {label}
        </button>
    )
}
export default Button;