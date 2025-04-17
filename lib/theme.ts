import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const theme = {
  colors: {
    primary: "#003366", // Dark Blue
    secondary: "#00FF7F", // Neon Green
    accent: "#000000", // Black
    alert: {
      error: "#FF0000", // Red
      warning: "#FFA500", // Amber/Orange
      success: "#008000", // Green
    },
    neutral: {
      background: "#F5F5F5", // Light Grey
      white: "#FFFFFF",
      text: {
        primary: "#333333", // Dark Grey
        secondary: "#666666", // Medium Grey
        tertiary: "#999999", // Light Grey
      },
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Open Sans', sans-serif",
    fontSize: {
      h1: "32px",
      h2: "24px",
      h3: "18px",
      body: "16px",
      small: "14px",
      caption: "12px",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
}
