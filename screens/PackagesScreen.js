import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PACKAGES } from '../data/packages';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import { AntDesign, Feather } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../utils/api';

const { width } = Dimensions.get('window');

const PackageCard = ({ item, index, isAdded, onToggleWishlist, formatPrice }) => {
    const navigation = useNavigation();

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 150).springify().damping(12)}
            style={styles.cardContainer}
        >
            <ImageBackground
                source={{ uri: item.image_url }}
                style={styles.cardBackground}
                imageStyle={{ borderRadius: 16 }}
            >
                <View style={styles.cardOverlay}>
                    <View style={styles.topRow}>
                        <View style={styles.durationBadge}>
                            <Text style={styles.durationText}>{item.duration}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.wishlistIcon}
                            onPress={() => onToggleWishlist(item.id, isAdded)}
                        >
                            <AntDesign name={isAdded ? "heart" : "hearto"} size={24} color={isAdded ? "#E5A93C" : "#fff"} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomContent}>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

                        <View style={styles.actionRow}>
                            <View style={styles.priceBadge}>
                                <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('PackageDetails', { item })}
                            >
                                <Text style={styles.buttonText}>{item.viewDetailsLabel || 'View Details'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </Animated.View>
    );
};

export default function PackagesScreen({ navigation }) {
    const [wishlistIds, setWishlistIds] = useState([]);
    const { currency, setCurrency, availableCurrencies, formatPrice } = useCurrency();
    const { colors } = useTheme();
    const { t } = useLanguage();

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`${API_URL}/wishlist`);
            setWishlistIds(response.data.wishlist || []);
        } catch (error) {
            console.warn('Backend not running, ignored fetching wishlist', error.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWishlist();
        }, [])
    );

    const toggleWishlist = async (id, currentlyAdded) => {
        // Optimistic update for immediate feedback
        if (currentlyAdded) {
            setWishlistIds(prev => prev.filter(pkgId => pkgId !== id));
            try {
                await axios.delete(`${API_URL}/wishlist/${id}`);
            } catch (err) {
                console.warn('Delete failed, reverting UI', err);
                setWishlistIds(prev => [...prev, id]);
            }
        } else {
            setWishlistIds(prev => [...prev, id]);
            try {
                await axios.post(`${API_URL}/wishlist`, { packageId: id });
            } catch (err) {
                console.warn('Add failed, reverting UI', err);
                setWishlistIds(prev => prev.filter(pkgId => pkgId !== id));
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('discover')}</Text>
                        <Text style={[styles.headerSubtitle, { color: colors.primary }]}>{t('exclusiveExperiences') || 'Exclusive safari experiences'}</Text>
                    </View>
                    <View style={styles.headerActionRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.iconBg, borderColor: colors.border }]}
                            onPress={() => navigation.navigate('ARScanner')}
                        >
                            <Feather name="aperture" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.iconBg, borderColor: colors.border }]}
                            onPress={() => navigation.navigate('WildlifeCalendar')}
                        >
                            <Feather name="calendar" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
                    {availableCurrencies.map(curr => (
                        <TouchableOpacity
                            key={curr}
                            style={[
                                styles.currencyPill,
                                { backgroundColor: colors.iconBg, borderColor: colors.border },
                                currency === curr && styles.currencyPillActive
                            ]}
                            onPress={() => setCurrency(curr)}
                        >
                            <Text style={[styles.currencyText, currency === curr && styles.currencyTextActive]}>
                                {curr}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={PACKAGES}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <PackageCard
                        item={{ ...item, viewDetailsLabel: t('viewDetails') || 'View Details' }}
                        index={index}
                        isAdded={wishlistIds.includes(item.id)}
                        onToggleWishlist={toggleWishlist}
                        formatPrice={formatPrice}
                    />
                )}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#E5A93C', // Premium Gold
        marginTop: 6,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerActionRow: {
        flexDirection: 'row',
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginLeft: 10,
    },
    currencyScroll: {
        marginTop: 16,
    },
    currencyPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    currencyPillActive: {
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        borderColor: '#E5A93C',
    },
    currencyText: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: 'bold',
    },
    currencyTextActive: {
        color: '#E5A93C',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    cardContainer: {
        marginBottom: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    cardBackground: {
        height: 280,
        width: '100%',
    },
    cardOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 16,
        padding: 20,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    durationBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    durationText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    wishlistIcon: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        borderRadius: 20,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceBadge: {
        backgroundColor: '#E5A93C',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    priceText: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 14,
    },
    bottomContent: {
        justifyContent: 'flex-end',
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    description: {
        color: '#e0e0e0',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    button: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
