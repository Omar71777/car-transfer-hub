
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
				// New blue-centered color system
				electric: {
					DEFAULT: '#0066CC', // Blue
					light: '#3399FF', // Light Blue
					dark: '#004C99', // Dark Blue
				},
				aqua: {
					DEFAULT: '#00CCFF', // Cyan
					light: '#99EEFF', // Light Cyan
					dark: '#0099CC', // Dark Cyan
				},
				vibrant: {
					DEFAULT: '#FF6B6B', // Coral Pink (keep as accent)
					light: '#FF9E9E', // Light Coral
					dark: '#E63946', // Imperial Red
				},
				foam: {
					DEFAULT: '#F0F8FF', // Alice Blue
					light: '#FFFFFF', // White
					dark: '#E6F2FF', // Very Light Blue
				},
				pine: {
					DEFAULT: '#4CAF50', // Green
					light: '#8BC34A', // Light Green
					dark: '#2E7D32', // Dark Green
				},
				sand: {
					DEFAULT: '#FFDAB9', // Peach Puff
					light: '#FFE4C4', // Bisque
					dark: '#FFCC99', // Light Peach
				},
				lavender: {
					DEFAULT: '#E6E6FA', // Lavender
					light: '#F5F5FF', // Light Lavender
					dark: '#D8BFD8', // Thistle
				},
				charcoal: {
					DEFAULT: '#36454F', // Charcoal
					dark: '#1A1A2E', // Very Dark Blue
					light: '#4B5D67', // Slate Gray
				},
				soft: {
					beige: '#F5F2ED',
					gray: '#F1F0FB',
					peach: '#FDE1D3',
					pink: '#FFDEE2',
					blue: '#D3E4FD',
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
				'gradient-aqua': 'linear-gradient(to right, #00FFFF, #AFEEEE)',
				'gradient-vibrant': 'linear-gradient(to right, #FF6B6B, #FF9E9E)',
				'gradient-foam': 'linear-gradient(to right, #F0F8FF, #FFFFFF)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
