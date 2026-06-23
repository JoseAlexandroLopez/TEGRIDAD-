export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#5C8001',
      light: '#7CB518',
    },
    secondary: {
      main: '#FB6107',
      dark: '#E55300',
    },
    warning: {
      main: '#F3DE2C',
    },
    background: {
      default: mode === 'light' ? '#F4F6F8' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
    text: {
      primary: mode === 'light' ? '#333333' : '#E0E0E0',
      secondary: mode === 'light' ? '#666666' : '#A0A0A0',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});