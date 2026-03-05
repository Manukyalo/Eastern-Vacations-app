import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PACKAGES } from '../data/packages';

const { width } = Dimensions.get('window');

const PackageCard = ({ item, index }) => {
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
                        <View style={styles.priceBadge}>
                            <Text style={styles.priceText}>Quote</Text>
                        </View>
                    </View>

                    <View style={styles.bottomContent}>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>View Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </Animated.View>
    );
};

export default function PackagesScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kenya Tours</Text>
                <Text style={styles.headerSubtitle}>Exclusive safari experiences</Text>
            </View>

            <FlatList
                data={PACKAGES}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <PackageCard item={item} index={index} />}
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
    priceBadge: {
        backgroundColor: '#E5A93C',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    priceText: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 12,
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
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
