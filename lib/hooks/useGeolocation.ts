// lib/hooks/useGeolocation.ts
// Hook to detect user's country and currency

'use client';

import { useState, useEffect } from 'react';

interface GeoInfo {
    country: string;
    countryCode: string;
    currency: 'KES' | 'USD';
    currencySymbol: string;
    loading: boolean;
}

const CURRENCY_CONFIG = {
    KES: {
        symbol: 'KES ',
        rate: 130, // Approximate USD to KES rate
    },
    USD: {
        symbol: '$',
        rate: 1,
    },
};

export function useGeolocation(): GeoInfo {
    const [geoInfo, setGeoInfo] = useState<GeoInfo>({
        country: '',
        countryCode: '',
        currency: 'USD',
        currencySymbol: '$',
        loading: true,
    });

    useEffect(() => {
        async function detectLocation() {
            try {
                // Use free IP geolocation API
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                const isKenya = data.country_code === 'KE';

                setGeoInfo({
                    country: data.country_name || 'Unknown',
                    countryCode: data.country_code || '',
                    currency: isKenya ? 'KES' : 'USD',
                    currencySymbol: isKenya ? 'KES ' : '$',
                    loading: false,
                });
            } catch (error) {
                console.error('Geolocation error:', error);
                // Default to USD on error
                setGeoInfo({
                    country: 'Unknown',
                    countryCode: '',
                    currency: 'USD',
                    currencySymbol: '$',
                    loading: false,
                });
            }
        }

        detectLocation();
    }, []);

    return geoInfo;
}

// Helper function to format price based on currency
export function formatPrice(usdAmount: number, currency: 'KES' | 'USD'): string {
    const config = CURRENCY_CONFIG[currency];
    const amount = Math.round(usdAmount * config.rate);

    if (currency === 'KES') {
        return `KES ${amount.toLocaleString()}`;
    }
    return `$${amount}`;
}

// Get price in smallest unit for Paystack (cents/cents equivalent)
export function getPriceInSmallestUnit(usdAmount: number, currency: 'KES' | 'USD'): number {
    const config = CURRENCY_CONFIG[currency];
    // Paystack expects amount in smallest unit (cents for USD, cents for KES)
    return Math.round(usdAmount * config.rate * 100);
}
