/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                success: '#179C5F',
                error: '#FF3B30',
                info: '#007AFF',
                warning: '#FF9500',
                react: {
                    50: '#E3F8FF',
                    100: '#B3ECFF',
                    200: '#81DEFD',
                    300: '#5ED0FA',
                    400: '#40C3F7',
                    500: '#61DAFB',
                    600: '#1B9BFF',
                    700: '#0B83F0',
                    800: '#0071E3',
                    900: '#0055B4',
                }
            },
        },
    },
    plugins: [],
}

