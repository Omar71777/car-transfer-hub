
export default {
  theme: {
    extend: {
      backgroundColor: {
        'background': 'hsl(var(--background))',
        'muted': 'hsl(var(--muted))',
      },
      textColor: {
        'foreground': 'hsl(var(--foreground))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['DM Sans', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        primary: 'hsl(var(--primary))',
        muted: 'hsl(var(--muted))',
        sidebar: {
          DEFAULT: '#1A1F2C', 
          foreground: '#8E9196', 
          hover: '#1EAEDB', 
          selected: '#9b87f5',
        },
        'muted-foreground': 'hsl(var(--muted-foreground))',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
      }
    }
  }
}
