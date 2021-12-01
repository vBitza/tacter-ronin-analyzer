import { createTheme } from '@mui/material/styles';

const TacterTheme = createTheme({
  typography: {
    fontFamily: [
	    'Nunito',
      'Open Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    weight: '700px',
  },
});

export default TacterTheme;
