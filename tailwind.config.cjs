/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // HappyHODLers Brand Colors
        'happy-yellow': {
          DEFAULT: '#FACC15',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FACC15',
          600: '#F59E0B',
          700: '#D97706',
          800: '#B45309',
          900: '#92400E'
        },
        'happy-orange': {
          DEFAULT: '#FB923C',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12'
        },
        'happy-pink': {
          DEFAULT: '#F472B6',
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843'
        },
        // Paleta KIKK style (mantener para compatibilidad)
        'kikk-black': '#000000',
        'kikk-dark': '#111111',
        'kikk-white': '#FFFFFF',
        'kikk-orange': '#FF9900',
        'kikk-orange-light': '#FFA500',
        'kikk-gray-dark': '#333333',
        'kikk-gray': '#666666',
        // Colores originales mantenidos para compatibilidad
        //#000000, #FFFFFF, #FFA500, #FF8C00, #8A2BE2, #4B0082, #696969
        // #000000, #FFFFFF, #FFA500, #FF8C00, #FF4500, #F5F5DC
        'black': {
          DEFAULT: '#000000',
          100: '#000000',
          200: '#000000',
          300: '#000000',
          400: '#000000',
          500: '#000000',
          600: '#333333',
          700: '#666666',
          800: '#999999',
          900: '#cccccc'
        },
        'licorice': {
          DEFAULT: '#24120d',
          100: '#070403',
          200: '#0f0705',
          300: '#160b08',
          400: '#1e0f0b',
          500: '#24120d',
          600: '#693426',
          700: '#ac563e',
          800: '#ce8b78',
          900: '#e7c5bc'
        },
        'jet': {
          DEFAULT: '#33302f',
          100: '#0a0909',
          200: '#141313',
          300: '#1e1c1c',
          400: '#282625',
          500: '#33302f',
          600: '#5d5856',
          700: '#88817e',
          800: '#b0aba9',
          900: '#d7d5d4'
        },
        'giants-orange': {
          DEFAULT: '#f96230',
          100: '#391002',
          200: '#731f04',
          300: '#ac2f05',
          400: '#e63f07',
          500: '#f96230',
          600: '#fa8159',
          700: '#fba182',
          800: '#fcc0ac',
          900: '#fee0d5'
        },
        'sandy-brown': {
          DEFAULT: '#fca045',
          100: '#3f2001',
          200: '#7f4002',
          300: '#be6003',
          400: '#fb8106',
          500: '#fca045',
          600: '#fdb46a',
          700: '#fdc68f',
          800: '#fed9b5',
          900: '#feecda'
        },
        'rust': {
          DEFAULT: '#b94722',
          100: '#250e07',
          200: '#4a1d0e',
          300: '#6f2b14',
          400: '#94391b',
          500: '#b94722',
          600: '#db633a',
          700: '#e48a6c',
          800: '#edb19d',
          900: '#f6d8ce'
        },
        'red': {
          DEFAULT: '#ff0000',
          100: '#330000',
          200: '#660000',
          300: '#990000',
          400: '#cc0000',
          500: '#ff0000',
          600: '#ff3333',
          700: '#ff6666',
          800: '#ff9999',
          900: '#ffcccc'
        },
        'seasalt': {
          DEFAULT: '#fafafa',
          100: '#323232',
          200: '#646464',
          300: '#969696',
          400: '#c8c8c8',
          500: '#fafafa',
          600: '#fbfbfb',
          700: '#fcfcfc',
          800: '#fdfdfd',
          900: '#fefefe'
        }
      }
    },
  },
  plugins: [],
}

