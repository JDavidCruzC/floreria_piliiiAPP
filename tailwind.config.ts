
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
				// Colores personalizados para la florería usando CSS variables
				'floral-pink': 'var(--floral-pink)',
				'floral-pink-light': 'var(--floral-pink-light)',
				'floral-pink-dark': 'var(--floral-pink-dark)',
				'floral-rose': 'var(--floral-rose)',
				'floral-rose-dark': 'var(--floral-rose-dark)',
				'floral-peach': 'var(--floral-peach)',
				'floral-cream': 'var(--floral-cream)',
				'floral-lavender': 'var(--floral-lavender)',
				'floral-mint': 'var(--floral-mint)',
				'floral-green': 'var(--floral-green)',
				'floral-green-light': 'var(--floral-green-light)',
				// Legacy floral object for backwards compatibility
				floral: {
					rose: 'var(--floral-rose)',
					'rose-dark': 'var(--floral-rose-dark)',
					pink: 'var(--floral-pink)',
					'pink-dark': 'var(--floral-pink-dark)',
					green: 'var(--floral-green)',
					'green-light': 'var(--floral-green-light)',
					cream: 'var(--floral-cream)',
					lavender: 'var(--floral-lavender)',
					peach: 'var(--floral-peach)',
					mint: 'var(--floral-mint)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'flower-bloom': {
					'0%': { transform: 'scale(0.8) rotate(-5deg)', opacity: '0.8' },
					'50%': { transform: 'scale(1.05) rotate(2deg)', opacity: '1' },
					'100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
				},
				'gentle-sway': {
					'0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
					'33%': { transform: 'translateX(2px) rotate(0.5deg)' },
					'66%': { transform: 'translateX(-2px) rotate(-0.5deg)' }
				},
				'fade-in-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'flower-bloom': 'flower-bloom 0.6s ease-out',
				'gentle-sway': 'gentle-sway 4s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.5s ease-out'
			},
			fontFamily: {
				'serif': ['Playfair Display', 'serif'],
				'sans': ['Inter', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
