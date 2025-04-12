export default {
  theme: {
    extend: {
      backgroundColor: {
        'background': 'hsl(var(--background))',
      },
      textColor: {
        'foreground': 'hsl(var(--foreground))',
      },
      colors: {
        border: 'hsl(var(--border))',
        sidebar: {
          DEFAULT: '#1A1F2C', 
          foreground: '#8E9196', 
          hover: '#1EAEDB', 
          selected: '#9b87f5',
        }
      }
    }
  }
}
