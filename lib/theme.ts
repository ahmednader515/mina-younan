/**
 * Theme Configuration
 * 
 * Centralized theme colors for the application.
 * Change the brand color here to update the entire website theme.
 */

export const theme = {
  // Light theme brand color - blue
  brand: "#3B9EE8",
  brandLight: "#5BB3F0",
  brandDark: "#2282CC",

  // Dark theme brand color - gold
  darkBrand: "#D4AF37",
  darkBrandLight: "#E8C547",
  darkBrandDark: "#B8960F",
} as const;

// Helper function to get brand color with opacity
export const getBrandColor = (opacity: number = 1) => {
  if (opacity === 1) return theme.brand;
  // Convert hex to rgba
  const hex = theme.brand.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Export for use in Tailwind config
export default theme;

