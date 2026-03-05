import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_URL = 'http://192.168.0.101:3000/api'; // Local dev API

export default function SubscriptionScreen() {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (provider, tier) => {
        setLoading(true);
        try {
            // Mock payment data
            const payload = provider === 'pesapal'
                ? { tier, email: 'user@example.com' }
                : { tier, phoneNumber: '254700000000' };

            const response = await axios.post(`${API_URL}/subscribe/${provider}`, payload);

            if (response.data.success) {
                Alert.alert('Success!', response.data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Payment processing failed. Please try again.');
            console.warn(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Premium Membership</Text>
                <Text style={styles.headerSubtitle}>Unlock Exclusive Safari Perks</Text>
            </View>

            <View style={styles.benefitsContainer}>
                <View style={styles.benefitRow}>
                    <Text style={styles.bullet}>✓</Text>
                    <Text style={styles.benefitText}>Priority booking on all tour packages</Text>
                </View>
                <View style={styles.benefitRow}>
                    <Text style={styles.bullet}>✓</Text>
                    <Text style={styles.benefitText}>Exclusive discounts (up to 15% off)</Text>
                </View>
                <View style={styles.benefitRow}>
                    <Text style={styles.bullet}>✓</Text>
                    <Text style={styles.benefitText}>Dedicated 24/7 travel concierge</Text>
                </View>
                <View style={styles.benefitRow}>
                    <Text style={styles.bullet}>✓</Text>
                    <Text style={styles.benefitText}>Free airport transfers in Nairobi & Mombasa</Text>
                </View>
            </View>

            <View style={styles.pricingCard}>
                <Text style={styles.tierName}>Gold Tier</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.currency}>KES </Text>
                    <Text style={styles.price}>5,000</Text>
                    <Text style={styles.duration}>/ year</Text>
                </View>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#E5A93C" />
                        <Text style={styles.loaderText}>Processing Payment...</Text>
                    </View>
                ) : (
                    <View style={styles.paymentSection}>
                        <Text style={styles.paymentHeader}>Select Payment Method:</Text>

                        <TouchableOpacity
                            style={[styles.paymentButton, styles.mpesaButton]}
                            onPress={() => handleSubscribe('mpesa', 'gold')}
                        >
                            <Text style={styles.mpesaButtonText}>Pay with M-PESA</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.paymentButton, styles.pesapalButton]}
                            onPress={() => handleSubscribe('pesapal', 'gold')}
                        >
                            <Text style={styles.pesapalButtonText}>Pay with Pesapal</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 60,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#E5A93C', // Premium Gold
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#ccc',
        marginTop: 8,
        textAlign: 'center',
    },
    benefitsContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(229,169,60,0.3)',
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    bullet: {
        color: '#E5A93C',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 12,
    },
    benefitText: {
        color: '#fff',
        fontSize: 15,
        flex: 1,
    },
    pricingCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#E5A93C',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    tierName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 30,
    },
    currency: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
    price: {
        fontSize: 42,
        fontWeight: '900',
        color: '#111',
    },
    duration: {
        fontSize: 16,
        color: '#666',
        marginLeft: 4,
    },
    loaderContainer: {
        padding: 30,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 12,
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    paymentSection: {
        width: '100%',
    },
    paymentHeader: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
        fontWeight: '600',
    },
    paymentButton: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
    },
    mpesaButton: {
        backgroundColor: '#4CAF50', // M-Pesa Green
        borderColor: '#388E3C',
    },
    mpesaButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pesapalButton: {
        backgroundColor: '#1E88E5', // Pesapal Blue
        borderColor: '#1565C0',
    },
    pesapalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
