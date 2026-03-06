import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function FloatingChatIcon() {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                onPress={() => navigation.navigate('Chatbot')}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="crown-outline" size={32} color="#111" />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90, // Positioned slightly above the bottom tab bar
        right: 20,
        zIndex: 9999,
    },
    button: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    }
});
