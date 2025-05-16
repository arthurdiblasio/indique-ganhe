"use client";

import { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
}

export function PrimaryButton({
  children,
  className,
  isLoading = false,
  loadingText = "Carregando...",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`bg-cyan-800 text-white hover:bg-cyan-900 py-3 px-5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed ${
        className ?? ""
      }`}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
