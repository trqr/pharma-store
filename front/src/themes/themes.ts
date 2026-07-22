import {createTheme} from "@mui/material";

export const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: '#282828',
          paper: '#2e2e2e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#9e9d9d',
        },
        primary: {
          main: '#38b37f',
        },
        secondary: {
          main: '#c6d3c6',
        },
        error: {
          main: '#df5050',
        },
        warning: {
          main: '#ff9800',
        },
      },
    },
    light: {
      palette: {
        background: {
          default: '#ffffff',
          paper: '#f5f5f5',
        },
        text: {
          primary: '#282828',
          secondary: '#6e6e6e',
        },
        primary: {
          main: '#7fbfbb',
        },
        secondary: {
          main: '#9ab393',
        },
        error: {
          main: '#df5050',
        },
        warning: {
          main: '#ff9800',
        },
      },

    },

  },
  components: {
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

