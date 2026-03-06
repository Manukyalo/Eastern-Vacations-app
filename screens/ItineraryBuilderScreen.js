import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const INITIAL_ITINERARY = [
    { id: '1', title: 'Arrival in Nairobi', type: 'flight', time: 'Day 1 - 08:00 AM', description: 'Touch down at JKIA, transfer to hotel.' },
    { id: '2', title: 'Giraffe Centre Visit', type: 'activity', time: 'Day 1 - 02:00 PM', description: 'Feed the endangered Rothschild giraffes.' },
    { id: '3', title: 'Transfer to Masai Mara', type: 'transport', time: 'Day 2 - 07:00 AM', description: 'Scenic drive through the Great Rift Valley.' },
    { id: '4', title: 'Afternoon Game Drive', type: 'safari', time: 'Day 2 - 04:00 PM', description: 'First glimpse of the big five in the Mara.' },
    { id: '5', title: 'Hot Air Balloon Safari', type: 'activity', time: 'Day 3 - 05:00 AM', description: 'Sunrise balloon ride followed by champagne breakfast.' },
    { id: '6', title: 'Relax at Diani Beach', type: 'beach', time: 'Day 5', description: 'Fly to the coast for some relaxation.' },
];

const getIconForType = (type) => {
    switch (type) {
        case 'flight': return <Feather name="plane" size={24} color="#E5A93C" />;
        case 'activity': return <Feather name="camera" size={24} color="#E5A93C" />;
        case 'transport': return <Feather name="truck" size={24} color="#E5A93C" />;
        case 'safari': return <MaterialCommunityIcons name="elephant" size={24} color="#E5A93C" />;
        case 'beach': return <Feather name="sun" size={24} color="#E5A93C" />;
        default: return <Feather name="map-pin" size={24} color="#E5A93C" />;
    }
}

export default function ItineraryBuilderScreen() {
    const [data, setData] = useState(INITIAL_ITINERARY);
    const { colors } = useTheme();

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[styles.itemContainer, { backgroundColor: isActive ? 'rgba(229, 169, 60, 0.2)' : colors.card, borderColor: colors.border }]}
                >
                    <View style={styles.iconContainer}>
                        {getIconForType(item.type)}
                    </View>
                    <View style={styles.itemContent}>
                        <Text style={styles.itemTime}>{item.time}</Text>
                        <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                        <Text style={[styles.itemDescription, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>
                    </View>
                    <View style={styles.dragHandle}>
                        <Feather name="menu" size={24} color={colors.textSecondary} />
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Trip Builder</Text>
                <Text style={[styles.headerSubtitle, { color: colors.primary }]}>Drag and drop to rearrange</Text>
            </View>

            <Animated.View entering={FadeInDown.duration(600)} style={styles.listWrapper}>
                <DraggableFlatList
                    data={data}
                    onDragEnd={({ data }) => setData(data)}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            </Animated.View>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save Itinerary</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
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
        borderBottomColor: 'rgba(255,255,255,0.1)',
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
    listWrapper: {
        flex: 1,
    },
    listContainer: {
        padding: 20,
        paddingBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(229, 169, 60, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemTime: {
        color: '#E5A93C',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemDescription: {
        color: '#aaa',
        fontSize: 12,
        lineHeight: 16,
    },
    dragHandle: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        backgroundColor: '#0A0A0A',
    },
    saveButton: {
        backgroundColor: '#E5A93C',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#111',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
