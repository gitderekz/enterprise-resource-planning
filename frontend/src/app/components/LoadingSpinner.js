'use client';
import { useTheme } from '../lib/ThemeContext';
import { useSharedStyles } from '../sharedStyles';

export default function LoadingSpinner() {
  const { colors, theme } = useSharedStyles();
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: colors[theme].background
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: `5px solid ${colors[theme].primary}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}