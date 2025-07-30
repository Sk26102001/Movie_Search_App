import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeModeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);

