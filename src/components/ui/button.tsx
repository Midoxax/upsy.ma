import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* U.Psy Liquid-Glass Variants */
        primary: "rounded-u-sm font-medium text-base px-6 py-3 min-h-[48px] text-u-black hover:opacity-90 hover:shadow-gold",
        secondary: "bg-transparent text-u-white border border-white/10 rounded-u-sm hover:border-white/20 hover:bg-white/5 font-medium text-base px-6 py-3 min-h-[48px]",
        tertiary: "text-u-white hover:text-u-gold bg-transparent border-none p-0 h-auto font-medium transition-colors duration-200",

        /* Standard variants */
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-u-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-u-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-u-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-u-sm",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
        hero: "h-14 px-8 text-lg font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const goldGradientStyle = variant === "primary"
      ? { background: 'linear-gradient(135deg, #FFB300, #F4A300)', ...style }
      : style;
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} style={goldGradientStyle} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
