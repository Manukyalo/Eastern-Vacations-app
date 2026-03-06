import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

const translations = {
    'en': {
        hello: "Hello",
        settings: "Settings",
        language: "Language",
        darkMode: "Dark Mode",
        discover: "Discover",
        wishlist: "Wishlist",
        premium: "Premium",
        planner: "Planner"
    },
    'sw': {
        hello: "Jambo",
        settings: "Mipangilio",
        language: "Lugha",
        darkMode: "Hali ya Giza",
        discover: "Gundua",
        wishlist: "Orodha ya Matamanio",
        premium: "Pirimiamu",
        planner: "Mratibu"
    },
    'fr': {
        hello: "Bonjour",
        settings: "Paramètres",
        language: "Langue",
        darkMode: "Mode Sombre",
        discover: "Découvrir",
        wishlist: "Liste de Souhaits",
        premium: "Premium",
        planner: "Planificateur"
    },
    'de': {
        hello: "Hallo",
        settings: "Einstellungen",
        language: "Sprache",
        darkMode: "Dunkler Modus",
        discover: "Entdecken",
        wishlist: "Wunschzettel",
        premium: "Premium",
        planner: "Planer" // Corrected from default Planificateur to proper German Planer
    },
    'zh': {
        hello: "你好",
        settings: "设置",
        language: "语言",
        darkMode: "夜间模式",
        discover: "发现",
        wishlist: "心愿单",
        premium: "高级",
        planner: "计划员"
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('appLanguage');
            if (savedLanguage) {
                setLanguage(savedLanguage);
            }
        } catch (e) {
            console.error('Failed to load language', e);
        }
    };

    const changeLanguage = async (code) => {
        setLanguage(code);
        try {
            await AsyncStorage.setItem('appLanguage', code);
        } catch (e) {
            console.error('Failed to save language', e);
        }
    };

    const t = (key) => {
        return translations[language][key] || translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
