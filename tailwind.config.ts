
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['DM Sans', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					hover: 'hsl(var(--sidebar-hover))',
					selected: 'hsl(var(--sidebar-selected))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// New purple-centered color system
				electric: {
					DEFAULT: '#8A4FFF', // Purple
					light: '#B28AFF', // Light Purple
					dark: '#6A31D9', // Dark Purple
				},
				aqua: {
					DEFAULT: '#AE5CFF', // Violet
					light: '#D9ADFF', // Light Violet
					dark: '#8A2BE2', // Deep Violet
				},
				vibrant: {
					DEFAULT: '#FF6B9D', // Pink (keep as accent)
					light: '#FF9EBE', // Light Pink
					dark: '#E63980', // Deep Pink
				},
				foam: {
					DEFAULT: '#F8F6FF', // Light Purple White
					light: '#FFFFFF', // White
					dark: '#EDE9FF', // Very Light Purple
				},
				pine: {
					DEFAULT: '#9B4DCA', // Purple-tinted Green 
					light: '#BC8AE6', // Light Purple-Green
					dark: '#7A32A8', // Dark Purple-Green
				},
				sand: {
					DEFAULT: '#FFD9FA', // Light Pink Peach
					light: '#FFE4FF', // Lighter Pink
					dark: '#FFBFF2', // Pink Peach
				},
				lavender: {
					DEFAULT: '#E6E6FA', // Lavender
					light: '#F5F5FF', // Light Lavender
					dark: '#D8BFD8', // Thistle
				},
				charcoal: {
					DEFAULT: '#3A2F4D', // Purple-tinted Charcoal
					dark: '#1A172E', // Very Dark Purple
					light: '#574D67', // Purple Slate Gray
				},
				soft: {
					beige: '#F5F2ED',
					gray: '#F1F0FB', // Purple-tinted Gray
					peach: '#FDE1F3', // Purple-tinted Peach
					pink: '#FFDEE2',
					purple: '#EBD5FF', // Light Purple
					green: '#F2FCE2',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'theme-transition': {
					'0%': { opacity: '0.8' },
					'100%': { opacity: '1' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'shine': {
					'0%': { transform: 'translateX(-100%) rotate(30deg)' },
					'100%': { transform: 'translateX(200%) rotate(30deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'theme-transition': 'theme-transition 0.5s ease-out',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'shine': 'shine 6s infinite linear'
			},
			transitionProperty: {
				'theme': 'background-color, color, border-color, text-decoration-color, fill, stroke'
			},
			boxShadow: {
				'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
				'card': '0 2px 15px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
				'hover': '0 6px 25px rgba(0, 0, 0, 0.06)',
				'button': '0 2px 6px rgba(0, 0, 0, 0.04)',
			},
			backgroundImage: {
				'gradient-soft': 'linear-gradient(to right, #6A5ACD, #7B68EE)',
				'gradient-aqua': 'linear-gradient(to right, #AE5CFF, #D9ADFF)',
				'gradient-vibrant': 'linear-gradient(to right, #FF6B9D, #FF9EBE)',
				'gradient-foam': 'linear-gradient(to right, #F8F6FF, #FFFFFF)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
