import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "primary-color": "#FF4979",
        "secondary-color": "#090919",
        "gray-color": "#89858C",
        "gray-darken": "#2B2A2B",
        "gray-black": "#262626",
        "gray-light": "#E4E1E5",
        "gray-dark": "#C7C1CC",
      },
    },
  },
  plugins: [],
} satisfies Config;
