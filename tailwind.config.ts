
// In the existing Tailwind configuration, update the color definitions
export default {
  theme: {
    extend: {
      colors: {
        // Define border color separately to fix the border-border reference
        border: 'hsl(var(--border))',
        
        sidebar: {
          // Dark Blue-Gray background
          DEFAULT: '#1A1F2C', 
          // Soft gray for unselected text
          foreground: '#8E9196', 
          // Bright blue for hover and accent
          hover: '#1EAEDB', 
          // Vibrant purple for selection
          selected: '#9b87f5',
        }
      }
    }
  }
}
