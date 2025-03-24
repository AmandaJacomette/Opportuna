import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: FC<ButtonProps> = ({ className = "", variant = "primary", ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-semibold transition",
        variant === "primary"
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300",
        className
      )}
      {...props}
    />
  );
};
