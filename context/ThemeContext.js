import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const colorScheme = Appearance.getColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        try {
            await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const theme = {
        isDarkMode,
        toggleTheme,
        colors: {
            background: isDarkMode ? '#0A0A0A' : '#F9FAFB', // Professional off-white
            card: isDarkMode ? '#1A1A1A' : '#FFFFFF',
            text: isDarkMode ? '#FFFFFF' : '#111827', // Slate-900 for robust contrast
            textSecondary: isDarkMode ? '#AAAAAA' : '#6B7280', // Slate-500
            primary: '#E5A93C', // Gold remains consistent
            border: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB', // Slate-200 border
            cardOverlay: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)',
            iconBg: isDarkMode ? 'rgba(255,255,255,0.1)' : '#F3F4F6', // Slate-100
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
