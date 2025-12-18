/** @type {import('tailwindcss').Config} */
import path from 'path';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    950: '#020617', // Force-defining the dark background
                }
            }
        },
    },
    plugins: [],
}