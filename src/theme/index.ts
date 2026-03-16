import { createTheme, type PaletteMode } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import { esES as dataGridEsES } from '@mui/x-data-grid/locales';
import { esES as datePickerEsES } from '@mui/x-date-pickers/locales';

export const getTheme = (mode: PaletteMode) =>
  createTheme(
    {
      palette: {
        mode,
        primary: {
          main: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb',
        },
        secondary: {
          main: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
        error: {
          main: '#ef4444',
        },
        warning: {
          main: '#f59e0b',
        },
        success: {
          main: '#22c55e',
        },
        ...(mode === 'light'
          ? {
              background: {
                default: '#f1f5f9',
                paper: '#ffffff',
              },
              text: {
                primary: '#1e293b',
                secondary: '#64748b',
              },
            }
          : {
              background: {
                default: '#0f172a',
                paper: '#1e293b',
              },
              text: {
                primary: '#f1f5f9',
                secondary: '#94a3b8',
              },
            }),
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
          fontWeight: 700,
          '@media (max-width:600px)': {
            fontSize: '1.5rem',
          },
        },
        h5: {
          fontWeight: 700,
          '@media (max-width:600px)': {
            fontSize: '1.25rem',
          },
        },
        h6: {
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 10,
              fontWeight: 600,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              boxShadow:
                mode === 'light'
                  ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)'
                  : '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
              border:
                mode === 'light'
                  ? '1px solid rgba(0,0,0,0.05)'
                  : '1px solid rgba(255,255,255,0.05)',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              borderRadius: 0,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    },
    esES,
    dataGridEsES,
    datePickerEsES,
  );

export default getTheme('light');
