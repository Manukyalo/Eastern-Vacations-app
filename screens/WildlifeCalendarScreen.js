import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const WILDLIFE_EVENTS = {
    'Jan': [
        { title: 'Calving Season Begins', location: 'Southern Serengeti / Ndutu', description: 'Thousands of wildebeest calves are born daily, attracting high concentrations of predators.', image: 'https://images.unsplash.com/photo-1517409081823-74b857dc4626?q=80&w=1000' }
    ],
    'Feb': [
        { title: 'Peak Calving Season', location: 'Ndutu Plains', description: 'The absolute best time to see predator-prey interactions as big cats hunt the newborn calves.', image: 'https://images.unsplash.com/photo-1549473448-5d7196c91f48?q=80&w=1000' }
    ],
    'Mar': [
        { title: 'Green Season Safari', location: 'Masai Mara / Serengeti', description: 'Lush green landscapes, fewer crowds, and fantastic bird watching as migratory birds arrive.', image: 'https://images.unsplash.com/photo-1522051664127-d0d5bfa53d5a?q=80&w=1000' }
    ],
    'Jul': [
        { title: 'The Great Migration River Crossing', location: 'Mara River', description: 'Millions of wildebeest and zebra face crocodile-infested waters. Nature\'s most dramatic spectacle.', image: 'https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?q=80&w=1000' }
    ],
    'Aug': [
        { title: 'Peak Migration in the Mara', location: 'Masai Mara', description: 'The mega-herds settle in the Masai Mara plains. Excellent river crossings and high predator activity.', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000' }
    ],
    'Oct': [
        { title: 'Herds Move South', location: 'Northern Serengeti', description: 'The migration starts heading back down towards Tanzania in search of fresh grazing.', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1000' }
    ]
};

export default function WildlifeCalendarScreen({ navigation }) {
    const [selectedMonth, setSelectedMonth] = useState('Jul');
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.iconBg }]} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Wildlife Event Calendar</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.primary }]}>Discover nature's rhythms</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={[styles.timelineContainer, { borderBottomColor: colors.border }]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {MONTHS.map((month) => {
                        const hasEvent = !!WILDLIFE_EVENTS[month];
                        const isSelected = month === selectedMonth;

                        return (
                            <TouchableOpacity
                                key={month}
                                onPress={() => setSelectedMonth(month)}
                                style={[styles.monthPill, { backgroundColor: colors.iconBg, borderColor: colors.border }, isSelected && styles.monthPillSelected]}
                            >
                                <Text style={[styles.monthText, isSelected && styles.monthTextSelected]}>{month}</Text>
                                {hasEvent && <View style={[styles.eventDot, isSelected && styles.eventDotSelected]} />}
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {WILDLIFE_EVENTS[selectedMonth] ? (
                    WILDLIFE_EVENTS[selectedMonth].map((event, index) => (
                        <Animated.View key={index} entering={FadeInDown.delay(index * 150).springify()} style={styles.eventCard}>
                            <ImageBackground source={{ uri: event.image }} style={styles.eventImage} imageStyle={{ borderRadius: 16 }}>
                                <View style={styles.eventOverlay}>
                                    <View style={styles.locationBadge}>
                                        <Feather name="map-pin" size={12} color="#E5A93C" />
                                        <Text style={styles.locationText}>{event.location}</Text>
                                    </View>
                                    <View style={styles.bottomContent}>
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <Text style={styles.eventDescription}>{event.description}</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </Animated.View>
                    ))
                ) : (
                    <Animated.View entering={FadeInDown} style={[styles.emptyState, { backgroundColor: colors.iconBg, borderColor: colors.border }]}>
                        <Feather name="calendar" size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>Quiet Season</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>While there are no major continent-wide migrations this month, resident wildlife is still abundant in most parks!</Text>
                    </Animated.View>
                )}
            </ScrollView>
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#E5A93C', // Premium Gold
        marginTop: 4,
    },
    timelineContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        paddingBottom: 20,
    },
    monthPill: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginRight: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    monthPillSelected: {
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        borderColor: '#E5A93C',
    },
    monthText: {
        color: '#888',
        fontSize: 16,
        fontWeight: '600',
    },
    monthTextSelected: {
        color: '#E5A93C',
        fontWeight: 'bold',
    },
    eventDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#666',
        marginTop: 4,
    },
    eventDotSelected: {
        backgroundColor: '#E5A93C',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    eventCard: {
        height: 300,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    eventImage: {
        width: '100%',
        height: '100%',
    },
    eventOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        padding: 20,
        justifyContent: 'space-between',
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(229, 169, 60, 0.5)',
    },
    locationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    bottomContent: {
        justifyContent: 'flex-end',
    },
    eventTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    eventDescription: {
        color: '#ccc',
        fontSize: 15,
        lineHeight: 22,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 250,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        padding: 30,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    emptyDesc: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    }
});
