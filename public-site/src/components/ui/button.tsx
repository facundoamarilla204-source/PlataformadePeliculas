"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-[0_0_15px_rgba(229,9,20,0.5)] hover:shadow-[0_0_25px_rgba(229,9,20,0.8)]":
              variant === "primary",
            "bg-neutral-800 text-white hover:bg-neutral-700": variant === "secondary",
            "border border-neutral-700 text-white hover:bg-neutral-800": variant === "outline",
            "text-neutral-300 hover:text-white hover:bg-neutral-800": variant === "ghost",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-12 px-8 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
