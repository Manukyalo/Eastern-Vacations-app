import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

export default function GroupBookingScreen({ route, navigation }) {
    const { item } = route.params;
    const { formatPrice } = useCurrency();

    // Group State
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const basePrice = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
        : item.price;

    const childDiscount = 0.5; // 50% off for kids
    const groupDiscountThreshold = 4; // 4+ people get a discount
    const groupDiscountRate = 0.1; // 10% off for large groups

    const totalPeople = adults + children;

    let subtotal = (adults * basePrice) + (children * basePrice * childDiscount);
    let discount = 0;

    if (totalPeople >= groupDiscountThreshold) {
        discount = subtotal * groupDiscountRate;
    }

    const total = subtotal - discount;

    const Counter = ({ title, subtitle, value, onIncrement, onDecrement, min }) => (
        <View style={styles.counterRow}>
            <View>
                <Text style={[styles.counterTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.counterSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.controlBtn, { backgroundColor: colors.iconBg }, value <= min && styles.controlBtnDisabled]}
                    onPress={onDecrement}
                    disabled={value <= min}
                >
                    <Feather name="minus" size={20} color={value <= min ? '#666' : colors.text} />
                </TouchableOpacity>
                <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
                <TouchableOpacity style={[styles.controlBtn, { backgroundColor: colors.iconBg }]} onPress={onIncrement}>
                    <Feather name="plus" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.iconBg }]} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Group Booking</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.summaryCard, { backgroundColor: 'rgba(229, 169, 60, 0.1)', borderColor: colors.primary }]}>
                    <Text style={[styles.packageTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={styles.basePriceText}>Base Price: {formatPrice(basePrice)} / adult</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Manage Members</Text>
                    <View style={[styles.countersContainer, { backgroundColor: colors.iconBg, borderColor: colors.border }]}>
                        <Counter
                            title="Adults"
                            subtitle="Age 13+"
                            value={adults}
                            onIncrement={() => setAdults(a => a + 1)}
                            onDecrement={() => setAdults(a => a - 1)}
                            min={1}
                        />
                        <View style={styles.divider} />
                        <Counter
                            title="Children"
                            subtitle="Age 2-12 (50% Off)"
                            value={children}
                            onIncrement={() => setChildren(c => c + 1)}
                            onDecrement={() => setChildren(c => c - 1)}
                            min={0}
                        />
                    </View>
                </View>

                {totalPeople >= groupDiscountThreshold && (
                    <View style={styles.discountBanner}>
                        <Feather name="star" size={20} color="#E5A93C" style={{ marginRight: 10 }} />
                        <Text style={styles.discountText}>Group Discount Applied! (10% Off)</Text>
                    </View>
                )}

                <View style={[styles.checkoutSection, { backgroundColor: colors.iconBg, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Cost Breakdown</Text>

                    <View style={styles.receiptRow}>
                        <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Adults ({adults})</Text>
                        <Text style={[styles.receiptValue, { color: colors.text }]}>{formatPrice(adults * basePrice)}</Text>
                    </View>
                    <View style={styles.receiptRow}>
                        <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Children ({children})</Text>
                        <Text style={[styles.receiptValue, { color: colors.text }]}>{formatPrice(children * basePrice * childDiscount)}</Text>
                    </View>

                    {discount > 0 && (
                        <View style={styles.receiptRow}>
                            <Text style={styles.receiptLabelDiscount}>Group Discount</Text>
                            <Text style={styles.receiptValueDiscount}>-{formatPrice(discount)}</Text>
                        </View>
                    )}

                    <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                    </View>
                </View>

            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => navigation.navigate('Upsell', { item, groupDetails: { adults, children, total } })}
                >
                    <Text style={styles.confirmButtonText}>Continue to Payment</Text>
                    <Feather name="arrow-right" size={20} color="#111" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    summaryCard: {
        backgroundColor: 'rgba(229, 169, 60, 0.1)',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(229, 169, 60, 0.3)',
        marginBottom: 30,
    },
    packageTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    basePriceText: {
        color: '#E5A93C',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    countersContainer: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 20,
    },
    counterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    counterTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    counterSubtitle: {
        color: '#888',
        fontSize: 12,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlBtnDisabled: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    valueText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        width: 40,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 16,
    },
    discountBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#E5A93C',
        marginBottom: 30,
    },
    discountText: {
        color: '#E5A93C',
        fontWeight: 'bold',
        fontSize: 14,
    },
    checkoutSection: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        marginBottom: 40,
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    receiptLabel: {
        color: '#ccc',
        fontSize: 15,
    },
    receiptValue: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    receiptLabelDiscount: {
        color: '#E5A93C',
        fontSize: 15,
    },
    receiptValueDiscount: {
        color: '#E5A93C',
        fontSize: 15,
        fontWeight: '600',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    totalLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        color: '#E5A93C',
        fontSize: 22,
        fontWeight: '900',
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#0A0A0A',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    confirmButton: {
        backgroundColor: '#E5A93C',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 14,
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
