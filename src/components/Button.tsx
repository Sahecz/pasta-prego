import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled,
  type = "button",
  fullWidth,
}: ButtonProps) {
  const baseClasses =
    "py-3 px-6 rounded-full font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-brand-orange text-white shadow-lg shadow-brand-orange/30 hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100",
    secondary:
      "bg-white text-brand-dark shadow-md hover:shadow-lg border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/10 disabled:opacity-50 disabled:cursor-not-allowed",
    danger:
      "bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? "w-full" : ""
        } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
