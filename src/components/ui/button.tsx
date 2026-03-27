import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "neon";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lunar disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-lunar text-white hover:bg-[#3d72d6] shadow-[0_0_15px_rgba(79,142,247,0.4)] hover:shadow-[0_0_25px_rgba(79,142,247,0.6)]": variant === "primary",
            "border border-lunar text-lunar hover:bg-lunar/10": variant === "outline",
            "hover:bg-white/5 hover:text-white": variant === "ghost",
            "bg-transparent border border-neon text-neon text-glow hover:bg-neon hover:text-black hover:shadow-[0_0_20px_var(--color-neon)] rounded-full uppercase tracking-[0.2em] font-accent": variant === "neon",
            "h-9 px-4": size === "sm",
            "h-11 px-6": size === "md",
            "h-14 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
