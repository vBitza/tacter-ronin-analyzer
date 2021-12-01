import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import App from './App';
import TacterTheme from './tacterTheme';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={TacterTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
