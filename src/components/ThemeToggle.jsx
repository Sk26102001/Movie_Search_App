import React from 'react';
import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <IconButton onClick={toggleTheme} color="inherit" sx={{ float: 'right' , transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'rotate(20deg) scale(1.2)',
          },}}>
      {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}

