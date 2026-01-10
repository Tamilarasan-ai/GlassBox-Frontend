/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Base Backgrounds
                bg: "#0B1020",      // Main app shell
                panel: "#0E1528",   // Panels / sidebar
                surface: "#121A2F", // Chat bubbles, cards
                elevated: "#162041", // Input box, active areas

                // Accent & Brand
                primary: {
                    DEFAULT: "#3B82F6",
                    hover: "#2563EB",
                    gradient_start: "#3B82F6",
                    gradient_end: "#6366F1",
                },
                secondary: "#6366F1",
                agent: "#7C7CFF",   // Bot avatar
                success: "#22C55E", // LIVE status

                // Text
                text: {
                    primary: "#E5E7EB",
                    secondary: "#9CA3AF",
                    muted: "#6B7280",
                    disabled: "#4B5563",
                },

                // Borders
                border: {
                    soft: "rgba(255,255,255,0.06)",
                    divider: "rgba(255,255,255,0.08)",
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 0 1px rgba(255,255,255,0.04), 0 8px 30px rgba(0,0,0,0.4)',
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
            },
            animation: {
                'bounce': 'bounce 1s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                bounce: {
                    '0%, 100%': {
                        transform: 'translateY(-25%)',
                        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                    },
                    '50%': {
                        transform: 'translateY(0)',
                        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                    },
                },
            },
        },
    },
    plugins: [],
}
