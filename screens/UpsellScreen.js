import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/api';

export default function UpsellScreen({ route, navigation }) {
    // Determine if this came from Solo package or Group Booking
    const { item, groupDetails } = route.params || {};
    const { formatPrice } = useCurrency();
    const { colors } = useTheme();

    const [transferSelected, setTransferSelected] = useState(false);
    const [cityTourSelected, setCityTourSelected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Hardcoded Upsell Prices (Base USD equivalents)
    const TRANSFER_PRICE = 50;
    const CITY_TOUR_PRICE = 120;

    // Calculate base package price
    let baseTotal = 0;
    if (groupDetails) {
        // Came from GroupBookingScreen
        baseTotal = groupDetails.total;
    } else {
        // Came from PackageDetailsScreen (Solo)
        baseTotal = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
            : item.price;
    }

    let finalTotal = baseTotal;
    if (transferSelected) finalTotal += TRANSFER_PRICE;
    if (cityTourSelected) finalTotal += CITY_TOUR_PRICE;

    const handleConfirmBooking = async () => {
        setIsProcessing(true);
        try {
            // Build the string representation of extras
            let extras = [];
            if (transferSelected) extras.push('Airport Transfer');
            if (cityTourSelected) extras.push('Nairobi City Tour');

            const payload = {
                name: "Guest User", // Mocked auth
                email: "guest@example.com",
                packageInterest: item.title,
                preferences: `Extras: ${extras.length > 0 ? extras.join(', ') : 'None'}. Type: ${groupDetails ? 'Group Booking' : 'Solo Booking'}`,
                totalPrice: finalTotal
            };

            // Post to admin queue instead of normal queue
            const response = await axios.post(`${API_URL}/admin/queue`, payload);

            if (response.data.success) {
                navigation.navigate('Packages'); // Redirect to home
                alert('Booking Request Sent! Our Admin team will assign a driver shortly.');
            }
        } catch (error) {
            console.warn('Booking failed:', error.message);
            alert('Failed to connect to the backend server. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.iconBg }]} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Enhance Your Journey</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Make your trip unforgettable by adding these premium services.
                </Text>

                {/* Upsell Card 1: Airport Transfer */}
                <TouchableOpacity
                    style={[
                        styles.upsellCard,
                        { backgroundColor: colors.card, borderColor: transferSelected ? colors.primary : colors.border },
                        transferSelected && styles.upsellCardActive
                    ]}
                    onPress={() => setTransferSelected(!transferSelected)}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.cardInfo}>
                            <MaterialCommunityIcons name="car-limousine" size={28} color={transferSelected ? colors.primary : colors.textSecondary} />
                            <View style={styles.cardTextContainer}>
                                <Text style={[styles.cardTitle, { color: colors.text }]}>VIP Airport Transfer</Text>
                                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>Private luxury SUV transfer directly from JKIA to your lodge.</Text>
                            </View>
                        </View>
                        <View style={[styles.checkBox, { borderColor: transferSelected ? colors.primary : colors.border, backgroundColor: transferSelected ? colors.primary : 'transparent' }]}>
                            {transferSelected && <Feather name="check" size={16} color="#111" />}
                        </View>
                    </View>
                    <Text style={[styles.cardPrice, { color: colors.text }]}>+ {formatPrice(TRANSFER_PRICE)}</Text>
                </TouchableOpacity>

                {/* Upsell Card 2: City Tour */}
                <TouchableOpacity
                    style={[
                        styles.upsellCard,
                        { backgroundColor: colors.card, borderColor: cityTourSelected ? colors.primary : colors.border },
                        cityTourSelected && styles.upsellCardActive
                    ]}
                    onPress={() => setCityTourSelected(!cityTourSelected)}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.cardInfo}>
                            <MaterialCommunityIcons name="city-variant-outline" size={28} color={cityTourSelected ? colors.primary : colors.textSecondary} />
                            <View style={styles.cardTextContainer}>
                                <Text style={[styles.cardTitle, { color: colors.text }]}>Nairobi City Tour</Text>
                                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>Half-day guided tour covering the Giraffe Centre & David Sheldrick Trust.</Text>
                            </View>
                        </View>
                        <View style={[styles.checkBox, { borderColor: cityTourSelected ? colors.primary : colors.border, backgroundColor: cityTourSelected ? colors.primary : 'transparent' }]}>
                            {cityTourSelected && <Feather name="check" size={16} color="#111" />}
                        </View>
                    </View>
                    <Text style={[styles.cardPrice, { color: colors.text }]}>+ {formatPrice(CITY_TOUR_PRICE)}</Text>
                </TouchableOpacity>

                <View style={[styles.summarySection, { backgroundColor: colors.iconBg, borderColor: colors.border }]}>
                    <Text style={[styles.summaryTitle, { color: colors.text }]}>Booking Summary</Text>

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Safari Package</Text>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(baseTotal)}</Text>
                    </View>

                    {transferSelected && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>VIP Transfer</Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(TRANSFER_PRICE)}</Text>
                        </View>
                    )}

                    {cityTourSelected && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>City Tour</Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(CITY_TOUR_PRICE)}</Text>
                        </View>
                    )}

                    <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>Total Due</Text>
                        <Text style={[styles.totalValue, { color: colors.primary }]}>{formatPrice(finalTotal)}</Text>
                    </View>
                </View>

            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.confirmButton, { backgroundColor: colors.primary }]}
                    onPress={handleConfirmBooking}
                    disabled={isProcessing}
                >
                    <Text style={styles.confirmButtonText}>
                        {isProcessing ? 'Processing...' : 'Confirm Booking'}
                    </Text>
                    {!isProcessing && <Feather name="check-circle" size={20} color="#111" style={{ marginLeft: 8 }} />}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 24,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 30,
    },
    upsellCard: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        marginBottom: 20,
    },
    upsellCardActive: {
        backgroundColor: 'rgba(229,169,60,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardInfo: {
        flexDirection: 'row',
        flex: 1,
    },
    cardTextContainer: {
        marginLeft: 16,
        flex: 1,
        paddingRight: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
    checkBox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginLeft: 44,
    },
    summarySection: {
        borderRadius: 16,
        padding: 24,
        marginTop: 10,
        borderWidth: 1,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 16,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
    },
    totalLabel: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '900',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
    },
    confirmButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        shadowColor: '#E5A93C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    confirmButtonText: {
        color: '#111',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
