import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function PackageDetailsScreen({ route, navigation }) {
    const { item } = route.params;
    const { formatPrice } = useCurrency();
    const { colors } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} bounces={false}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                    <View style={styles.durationBadge}>
                        <Feather name="clock" size={14} color="#E5A93C" />
                        <Text style={styles.durationText}>{item.duration}</Text>
                    </View>
                </View>

                <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>

                {item.itinerary && item.itinerary.length > 0 && (
                    <View style={styles.itineraryContainer}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Detailed Itinerary</Text>
                        {item.itinerary.map((dayPlan, idx) => (
                            <View key={idx} style={styles.itineraryDay}>
                                <View style={styles.dayDot} />
                                <Text style={[styles.dayTitle, { color: colors.text }]}>Day {dayPlan.day}: {dayPlan.title}</Text>
                                <Text style={[styles.dayActivities, { color: colors.textSecondary }]}>{dayPlan.activities}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {(item.inclusions || item.exclusions) && (
                    <View style={styles.detailsSplit}>
                        {item.inclusions && item.inclusions.length > 0 && (
                            <View style={[styles.highlightsContainer, { backgroundColor: colors.iconBg, borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Included</Text>
                                {item.inclusions.map((inc, i) => (
                                    <View key={i} style={styles.highlightItem}>
                                        <AntDesign name="checkcircle" size={16} color="#4CAF50" />
                                        <Text style={[styles.highlightText, { color: colors.text }]}>{inc}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {item.exclusions && item.exclusions.length > 0 && (
                            <View style={[styles.highlightsContainer, { backgroundColor: colors.iconBg, borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Excluded</Text>
                                {item.exclusions.map((exc, i) => (
                                    <View key={i} style={styles.highlightItem}>
                                        <AntDesign name="closecircle" size={16} color="#E53935" />
                                        <Text style={[styles.highlightText, { color: colors.text }]}>{exc}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.actionContainer}>
                    <TouchableOpacity style={[styles.soloButton, { borderColor: colors.border }]}>
                        <Text style={[styles.soloButtonText, { color: colors.text }]}>Book Solo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.groupButton}
                        onPress={() => navigation.navigate('GroupBooking', { item })}
                    >
                        <Feather name="users" size={20} color="#111" style={{ marginRight: 8 }} />
                        <Text style={styles.groupButtonText}>Book as a Group</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    imageContainer: {
        width: width,
        height: 350,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceTag: {
        position: 'absolute',
        bottom: -20,
        right: 30,
        backgroundColor: '#E5A93C',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#E5A93C',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    },
    priceText: {
        color: '#111',
        fontWeight: '900',
        fontSize: 20,
    },
    contentContainer: {
        padding: 24,
        paddingTop: 40, // Space for the hovering price tag
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        marginRight: 16,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(229,169,60,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(229,169,60,0.3)',
    },
    durationText: {
        color: '#E5A93C',
        marginLeft: 6,
        fontWeight: '600',
        fontSize: 12,
    },
    description: {
        color: '#ccc',
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    itineraryContainer: {
        marginBottom: 30,
    },
    itineraryDay: {
        paddingLeft: 20,
        borderLeftWidth: 2,
        borderLeftColor: '#E5A93C',
        marginBottom: 20,
        position: 'relative',
    },
    dayDot: {
        position: 'absolute',
        top: 4,
        left: -6,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E5A93C',
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
    },
    dayActivities: {
        fontSize: 14,
        color: '#bbb',
        lineHeight: 22,
    },
    detailsSplit: {
        flexDirection: 'column',
    },
    highlightsContainer: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 20,
    },
    highlightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    highlightText: {
        color: '#fff',
        marginLeft: 12,
        fontSize: 14,
        flex: 1,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    soloButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginRight: 12,
    },
    soloButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    groupButton: {
        flex: 2,
        backgroundColor: '#E5A93C',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#E5A93C',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    groupButtonText: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
