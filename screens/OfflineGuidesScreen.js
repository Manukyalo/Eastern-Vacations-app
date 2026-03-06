import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const PARKS_DATA = [
    { id: '1', name: 'Masai Mara National Reserve', size: '145 MB', type: 'Map & Field Guide', category: 'Game Reserves' },
    { id: '2', name: 'Amboseli National Park', size: '85 MB', type: 'Map & Field Guide', category: 'National Parks' },
    { id: '3', name: 'Tsavo East & West', size: '210 MB', type: 'Comprehensive Guide', category: 'National Parks' },
    { id: '4', name: 'Lake Nakuru National Park', size: '60 MB', type: 'Birding Guide', category: 'National Parks' },
    { id: '5', name: 'Nairobi National Park', size: '45 MB', type: 'Map & Field Guide', category: 'National Parks' },
    { id: '6', name: 'Samburu National Reserve', size: '90 MB', type: 'Map & Field Guide', category: 'Game Reserves' },
    { id: '7', name: 'Ol Pejeta Conservancy', size: '75 MB', type: 'Map & Field Guide', category: 'Sanctuaries' },
    { id: '8', name: 'David Sheldrick Wildlife Trust', size: '30 MB', type: 'Visitor Guide', category: 'Sanctuaries' },
    { id: '9', name: 'Giraffe Centre', size: '25 MB', type: 'Visitor Guide', category: 'Sanctuaries' },
];

export default function OfflineGuidesScreen() {
    const [downloads, setDownloads] = useState({});
    const [activeCategory, setActiveCategory] = useState('National Parks');
    const categories = ['National Parks', 'Game Reserves', 'Sanctuaries'];
    const { colors } = useTheme();

    const handleDownload = (id) => {
        // Status transitions: 'none' -> 'downloading' -> 'done'
        setDownloads(prev => ({ ...prev, [id]: { status: 'downloading', progress: 0 } }));

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            if (currentProgress >= 100) {
                clearInterval(interval);
                setDownloads(prev => ({ ...prev, [id]: { status: 'done', progress: 100 } }));
            } else {
                setDownloads(prev => ({ ...prev, [id]: { status: 'downloading', progress: currentProgress } }));
            }
        }, 300); // Takes ~3 seconds
    };

    const handleDelete = (id) => {
        setDownloads(prev => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const renderItem = ({ item }) => {
        const downloadState = downloads[item.id];
        const isDownloading = downloadState?.status === 'downloading';
        const isDone = downloadState?.status === 'done';

        return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Feather name="map" size={24} color="#E5A93C" />
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={[styles.parkName, { color: colors.text }]}>{item.name}</Text>
                        <Text style={[styles.parkDetails, { color: colors.textSecondary }]}>{item.type} • {item.size}</Text>
                    </View>
                </View>

                {isDownloading && (
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>Downloading... {downloadState.progress}%</Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${downloadState.progress}%` }]} />
                        </View>
                    </View>
                )}

                <View style={styles.actionRow}>
                    {isDone ? (
                        <>
                            <View style={styles.statusBadge}>
                                <Feather name="check" size={14} color="#4CAF50" />
                                <Text style={styles.statusTextAvailable}>Available Offline</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Feather name="trash-2" size={18} color="#FF5252" />
                            </TouchableOpacity>
                        </>
                    ) : !isDownloading ? (
                        <TouchableOpacity
                            style={styles.downloadButton}
                            onPress={() => handleDownload(item.id)}
                        >
                            <Feather name="download-cloud" size={18} color="#111" />
                            <Text style={styles.downloadButtonText}>Download</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Offline Guides</Text>
                <Text style={[styles.headerSubtitle, { color: colors.primary }]}>Navigate parks without internet</Text>
            </View>

            <View style={[styles.infoBanner, { borderColor: colors.primary }]}>
                <MaterialCommunityIcons name="signal-off" size={24} color="#E5A93C" style={{ marginRight: 10 }} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    Many reserves have poor cellular reception. Download maps and animal guides before your trip.
                </Text>
            </View>

            <View style={styles.categoryContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryPill, { backgroundColor: colors.iconBg, borderColor: colors.border }, activeCategory === cat && styles.categoryPillActive]}
                            onPress={() => setActiveCategory(cat)}
                        >
                            <Text style={[styles.categoryText, { color: colors.textSecondary }, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={PARKS_DATA.filter(p => p.category === activeCategory)}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
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
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#E5A93C', // Premium Gold
        marginTop: 6,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: 'rgba(229,169,60,0.1)',
        padding: 16,
        marginHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(229,169,60,0.3)',
        marginBottom: 20,
    },
    infoText: {
        flex: 1,
        color: '#ccc',
        fontSize: 14,
        lineHeight: 20,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryScroll: {
        paddingHorizontal: 20,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    categoryPillActive: {
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        borderColor: '#E5A93C',
    },
    categoryText: {
        color: '#888',
        fontSize: 14,
        fontWeight: 'bold',
    },
    categoryTextActive: {
        color: '#E5A93C',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(229,169,60,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    parkName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    parkDetails: {
        color: '#888',
        fontSize: 13,
    },
    progressContainer: {
        marginTop: 8,
        marginBottom: 16,
    },
    progressText: {
        color: '#E5A93C',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
        textAlign: 'right',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#E5A93C',
        borderRadius: 3,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.3)',
    },
    statusTextAvailable: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 6,
    },
    deleteButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        borderRadius: 8,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5A93C',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    downloadButtonText: {
        color: '#111',
        fontWeight: 'bold',
        marginLeft: 8,
    }
});
