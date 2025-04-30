export interface ThemeColors {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    text: string;
  }
  
  export interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    colors: ThemeColors;
  }
  