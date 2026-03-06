import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import axios from 'axios';
import { PACKAGES } from '../data/packages'; // Local fallback data
import { useCurrency } from '../context/CurrencyContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import { API_URL } from '../utils/api';

const { width } = Dimensions.get('window');

const WishlistCard = ({ item, index, onRemove, formatPrice }) => {
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
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => onRemove(item.id)}
                    >
                        <Text style={styles.removeButtonText}>✕ Remove</Text>
                    </TouchableOpacity>

                    <View style={styles.bottomContent}>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.durationText}>{item.duration}</Text>
                        <View style={styles.actionRow}>
                            <View style={styles.priceBadge}>
                                <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('PackageDetails', { item })}
                            >
                                <Text style={styles.buttonText}>View Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </Animated.View>
    );
};

export default function WishlistScreen() {
    const [wishlistIds, setWishlistIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();
    const navigation = useNavigation();
    const { colors } = useTheme();

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`${API_URL}/wishlist`);
            setWishlistIds(response.data.wishlist);
        } catch (error) {
            console.warn('Backend not running, using empty wishlist', error.message);
            setWishlistIds([]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWishlist();
        }, [])
    );

    const removeFromWishlist = async (id) => {
        try {
            await axios.delete(`${API_URL}/wishlist/${id}`);
            setWishlistIds(prev => prev.filter(itemId => itemId !== id));
        } catch (error) {
            console.warn('Failed to remove from backend', error.message);
            // Optimistic update
            setWishlistIds(prev => prev.filter(itemId => itemId !== id));
        }
    };

    const wishlistPackages = PACKAGES.filter(pkg => wishlistIds.includes(pkg.id));

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>My Wishlist</Text>
                <Text style={[styles.headerSubtitle, { color: colors.primary }]}>Your saved dream safaris</Text>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#E5A93C" />
                </View>
            ) : wishlistPackages.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={[styles.emptyText, { color: colors.text }]}>Your wishlist is empty.</Text>
                    <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>Explore packages to add them here!</Text>
                </View>
            ) : (
                <FlatList
                    data={wishlistPackages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <WishlistCard item={item} index={index} onRemove={removeFromWishlist} formatPrice={formatPrice} />
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)'
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#E5A93C', // Premium Gold
        marginTop: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#888',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 100, // Account for Bottom Tabs
    },
    cardContainer: {
        marginBottom: 20,
        borderRadius: 16,
        height: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    cardBackground: {
        flex: 1,
        width: '100%',
    },
    cardOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
    },
    removeButton: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(255,50,50,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    bottomContent: {
        justifyContent: 'flex-end',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    durationText: {
        color: '#ddd',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
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
