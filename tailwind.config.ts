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
				ibiza: {
					50: '#e6f6ff',
					100: '#b3e0ff',
					200: '#80caff',
					300: '#4db4ff',
					400: '#1a9eff',
					500: '#0088e6',
					600: '#0066cc',
					700: '#0044b3',
					800: '#002299',
					900: '#000080',
				},
				electric: {
					DEFAULT: '#023E8A',
					light: '#045CB4',
					dark: '#012C61',
				},
				aqua: {
					DEFAULT: '#48CAE4',
					light: '#ADE8F4',
					dark: '#0096C7',
				},
				sand: {
					DEFAULT: '#F6BD60',
					light: '#FAD193',
					dark: '#E09F3E',
				},
				vibrant: {
					DEFAULT: '#FF6B6B',
					light: '#FF9E9E',
					dark: '#E63946',
				},
				foam: {
					DEFAULT: '#F7FFF7',
					light: '#FFFFFF',
					dark: '#E6F7E6',
				},
				pine: {
					DEFAULT: '#006D77',
					light: '#0A9396',
					dark: '#004F55',
				},
				soft: {
					beige: '#F5F2ED',
					gray: '#F1F0FB',
					peach: '#FDE1D3',
					pink: '#FFDEE2',
					blue: '#ADE8F4',
					green: '#F2FCE2',
				},
				charcoal: {
					DEFAULT: '#403E43',
					dark: '#221F26',
					light: '#5A5862',
				},
				warm: {
					DEFAULT: '#F6BD60',
					light: '#FAD193',
					dark: '#E09F3E',
				}
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
				'gradient-soft': 'linear-gradient(to right, #F6BD60, #FAD193)',
				'gradient-aqua': 'linear-gradient(to right, #48CAE4, #ADE8F4)',
				'gradient-electric': 'linear-gradient(to right, #023E8A, #045CB4)',
				'gradient-foam': 'linear-gradient(to right, #F7FFF7, #FFFFFF)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
