import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',   
        'xsmobile':{'max':'500px'},      
        'mobile': {'max': '640px'}, 
         'tablet': { 'min': '501px', 'max': '767px' },
      },
      colors: {
        foreground: "hsl(var(--foreground))",
        "primary-color": "#FF4979",
        "light-primary": "#ff497917",
        "secondary-color": "#090919",
        // 'secondary': '#090919',
        "gray-color": "#89858C",
        "gray-darken": "#2B2A2B",
        "gray-black": "#262626",
        "gray-light": "#E4E1E5",
        "gray-small-light": "#FAFAFA",
        "gray-dark": "#C7C1CC",
        "gray-desc": "#656466",
        "font-grey": "#7E7E80",
        "dark-orange": "#FF9500",
        text: "#262626",
        stroke: "#E6E6E6",
        success: "#038A00",
        "success-light": "#038A000D",
        background: "#F2F4F5",
        orange: "#FFBD80",
        "light-blue": "#BBEEED",
        blue: "#808EFF",
        purple: "#978FED",
        rating: "#FFAD33",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#FF4979",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#090919",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        20: "20px",
      },
      backgroundImage: {
        "pink-blue-gradient": "linear-gradient(1deg, #e9b9cf 0%, #d3f3f1 100%)",
        "custom-gradient": `
          linear-gradient(0deg, #ffffff00, #ffffff00),
          linear-gradient(87.38deg, 
            rgba(155, 95, 233, 0.4) -35.64%, 
            rgba(102, 132, 240, 0.4) 13.71%, 
            rgba(222, 89, 142, 0.4) 77.99%, 
            rgba(251, 177, 30, 0.4) 129.39%
          )
        `,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
