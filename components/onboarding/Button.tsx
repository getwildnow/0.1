"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: ReactNode;
}

export default function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
        variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300",
        variant === "outline" && "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

