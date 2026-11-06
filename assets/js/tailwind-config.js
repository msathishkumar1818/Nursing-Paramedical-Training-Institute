/**
 * Apex Nursing & Paramedical Training Institute
 * Tailwind CSS CDN Configuration
 * Enforces class-based dark mode so toggling 'dark' on <html> immediately switches all styles
 */
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#0056b3',
            dark: '#003d80',
            light: '#e8f2fc'
          },
          emergency: '#e63946',
          tealAccent: '#00b4d8'
        }
      }
    }
  };
} else {
  window.tailwind = window.tailwind || {};
  window.tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#0056b3',
            dark: '#003d80',
            light: '#e8f2fc'
          },
          emergency: '#e63946',
          tealAccent: '#00b4d8'
        }
      }
    }
  };
}
