import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

const translations = {
    'en': {
        hello: "Hello",
        settings: "Settings",
        language: "Language",
        darkMode: "Dark Mode",
        discover: "Kenya Tours",
        wishlist: "Wishlist",
        premium: "Premium",
        planner: "Planner",
        exclusiveExperiences: "Exclusive safari experiences",
        viewDetails: "View Details"
    },
    'sw': {
        hello: "Jambo",
        settings: "Mipangilio",
        language: "Lugha",
        darkMode: "Hali ya Giza",
        discover: "Ziara za Kenya",
        wishlist: "Orodha ya Matamanio",
        premium: "Pirimiamu",
        planner: "Mratibu",
        exclusiveExperiences: "Uzoefu maalum wa safari",
        viewDetails: "Tazama Maelezo"
    },
    'fr': {
        hello: "Bonjour",
        settings: "Paramètres",
        language: "Langue",
        darkMode: "Mode Sombre",
        discover: "Tours au Kenya",
        wishlist: "Liste de Souhaits",
        premium: "Premium",
        planner: "Planificateur",
        exclusiveExperiences: "Expériences de safari exclusives",
        viewDetails: "Voir les Détails"
    },
    'de': {
        hello: "Hallo",
        settings: "Einstellungen",
        language: "Sprache",
        darkMode: "Dunkler Modus",
        discover: "Kenia Touren",
        wishlist: "Wunschzettel",
        premium: "Premium",
        planner: "Planer",
        exclusiveExperiences: "Exklusive Safari-Erlebnisse",
        viewDetails: "Details Anzeigen"
    },
    'zh': {
        hello: "你好",
        settings: "设置",
        language: "语言",
        darkMode: "夜间模式",
        discover: "肯尼亚之旅",
        wishlist: "心愿单",
        premium: "高级",
        planner: "计划员",
        exclusiveExperiences: "独家野生动物园体验",
        viewDetails: "查看详情"
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
