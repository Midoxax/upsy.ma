import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        /* U.Psy Brand Colors */
        'u-burgundy': "hsl(var(--burgundy))",
        'u-charcoal': "hsl(var(--charcoal))",
        'u-gold': "hsl(var(--gold-accent))",
        'u-gold-highlight': "hsl(var(--gold-highlight))",
        'u-crimson': "hsl(var(--crimson))",
        'u-clinical': "hsl(var(--clinical-blue))",
        'u-clinical-light': "hsl(var(--clinical-light))",
        'u-lavender': "hsl(var(--lavender))",
        'u-turquoise': "hsl(var(--turquoise))",
        'u-white': "hsl(var(--white))",
        'u-black': "hsl(var(--black))",
        'u-gray-50': "hsl(var(--gray-50))",
        'u-gray-100': "hsl(var(--gray-100))",
        'u-gray-200': "hsl(var(--gray-200))",
        'u-gray-300': "hsl(var(--gray-300))",
        'u-gray-400': "hsl(var(--gray-400))",
        'u-gray-500': "hsl(var(--gray-500))",
        'u-gray-600': "hsl(var(--gray-600))",
        'u-gray-700': "hsl(var(--gray-700))",
        'u-gray-800': "hsl(var(--gray-800))",

        /* Semantic Colors */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      maxWidth: {
        'container': 'var(--max-width)',
      },
      spacing: {
        'gutter': 'var(--gutter)',
        'section': 'var(--section-spacing)',
        'section-mobile': 'var(--section-spacing-mobile)',
      },
      borderRadius: {
        'u-btn': 'var(--radius-btn)',
        'u-card': 'var(--radius-card)',
        'u-input': 'var(--radius-input)',
        'u-sm': 'var(--radius-btn)',
        'u-lg': 'var(--radius-card)',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'glass': 'var(--glass-shadow)',
        'glass-hover': 'var(--glass-shadow-hover)',
        'soft': 'var(--shadow-soft)',
        'gold': 'var(--shadow-gold)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
