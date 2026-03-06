import React, { createContext, useState, useContext } from 'react';

// Base currency is USD
const EXCHANGE_RATES = {
    USD: 1,
    KES: 135.50,
    EUR: 0.92,
    TZS: 2540.00,
    UGX: 3880.00,
    GBP: 0.79,
    AUD: 1.52,
    CAD: 1.35,
    ZAR: 18.90
};

const CURRENCY_SYMBOLS = {
    USD: '$',
    KES: 'Ksh ',
    EUR: '€',
    TZS: 'Tsh ',
    UGX: 'Ugx ',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    ZAR: 'R '
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');

    const formatPrice = (priceVal) => {
        // Convert string like "$3,500" or "ksh 1500" to a clean number
        let numericPrice = 0;
        if (typeof priceVal === 'string') {
            numericPrice = parseFloat(priceVal.replace(/[^0-9.-]+/g, ""));
        } else {
            numericPrice = priceVal;
        }

        // Apply exchange rate from base (USD)
        const converted = numericPrice * EXCHANGE_RATES[currency];

        // Format with commas and appropriate symbol
        const formattedNumber = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(converted);

        return `${CURRENCY_SYMBOLS[currency]}${formattedNumber}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, availableCurrencies: Object.keys(EXCHANGE_RATES) }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
