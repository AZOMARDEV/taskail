/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit-Regular", "sans-serif"],
        "outfit-bold": ["Outfit-Bold", "sans-serif"],
        "outfit-medium": ["Outfit-Medium", "sans-serif"],
        "outfit-light": ["Outfit-Light", "sans-serif"],
        "outfit-extra-light": ["Outfit-ExtraLight", "sans-serif"],
        "outfit-semi-bold": ["Outfit-SemiBold", "sans-serif"],
        "cairo": ["Cairo-Regular", "sans-serif"],
        "cairo-bold": ["Cairo-Bold", "sans-serif"],
        "cairo-medium": ["Cairo-Medium", "sans-serif"],
        "cairo-light": ["Cairo-Light", "sans-serif"],
        "cairo-extra-light": ["Cairo-ExtraLight", "sans-serif"],
        "cairo-semi-bold": ["Cairo-SemiBold", "sans-serif"],
        
      },
      colors: {
        primary: "#ffffff",
        accent: "#7980FF",
        "accent-hover": "#A2A7FF",
        "accent-dark": "#BCC0FF",
        "accent-light": "#D7D9FF",
      },
    },
  },
  plugins: [],
};
