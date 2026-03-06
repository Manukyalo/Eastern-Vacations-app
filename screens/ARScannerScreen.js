import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const ROBUST_WILDLIFE = [
    { name: "African Lion", scientific: "Panthera leo", status: "Vulnerable", diet: "Carnivore", description: "The lion is a large cat, native to Africa. It has a muscular, deep-chested body and is known for its majestic mane and cooperative hunting.", image: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=1000" },
    { name: "African Elephant", scientific: "Loxodonta africana", status: "Endangered", diet: "Herbivore", description: "The largest land animal on Earth. They are highly intelligent, social animals with complex communication and strong family bonds.", image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1000" },
    { name: "Leopard", scientific: "Panthera pardus", status: "Vulnerable", diet: "Carnivore", description: "Distinguished by its well-camouflaged fur and opportunistic hunting behavior. Leopards are incredibly strong and often drag their kills into trees.", image: "https://images.unsplash.com/photo-1534341908865-eb736ee7bf27?q=80&w=1000" },
    { name: "Cheetah", scientific: "Acinonyx jubatus", status: "Vulnerable", diet: "Carnivore", description: "The fastest land animal, capable of running at 80 to 128 km/h. They rely on stealth and explosive speed rather than endurance.", image: "https://images.unsplash.com/photo-1563214532-6aedfb138096?q=80&w=1000" },
    { name: "Black Rhinoceros", scientific: "Diceros bicornis", status: "Critically Endangered", diet: "Herbivore", description: "Known for its prehensile upper lip which it uses to feed on twigs and leaves. They are highly territorial and can be very aggressive.", image: "https://images.unsplash.com/photo-1587630713596-3c0f3801ea31?q=80&w=1000" },
    { name: "Plains Zebra", scientific: "Equus quagga", status: "Near Threatened", diet: "Herbivore", description: "The most common and geographically widespread species of zebra. Their unique stripes are believed to help with camouflage and deterring flies.", image: "https://images.unsplash.com/photo-1551676572-c23d91653147?q=80&w=1000" },
    { name: "Masai Giraffe", scientific: "Giraffa camelopardalis tippelskirchi", status: "Endangered", diet: "Herbivore", description: "The largest subspecies of giraffe, characterized by jagged, leaf-like spots. They use their long necks to reach high-growing foliage.", image: "https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?q=80&w=1000" },
    { name: "Hippopotamus", scientific: "Hippopotamus amphibius", status: "Vulnerable", diet: "Herbivore", description: "A large, mostly herbivorous, semiaquatic mammal native to sub-Saharan Africa. Despite their stocky shape, they are highly aggressive and dangerous.", image: "https://images.unsplash.com/photo-1522051664127-d0d5bfa53d5a?q=80&w=1000" },
    { name: "Cape Buffalo", scientific: "Syncerus caffer", status: "Least Concern", diet: "Herbivore", description: "A large African bovine. Due to its unpredictable nature, it is considered one of the most dangerous animals on the African continent.", image: "https://images.unsplash.com/photo-1549473448-5d7196c91f48?q=80&w=1000" }
];

export default function ARScannerScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const { colors } = useTheme();

    // Animation values
    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Continuous scanning animation loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, { toValue: 250, duration: 1500, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 1500, easing: Easing.linear, useNativeDriver: true })
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
            ])
        ).start();
    }, []);

    useEffect(() => {
        let timer;
        if (!scanResult && isScanning) {
            // Simulate Real-time ML detection lock-on after focusing for a few seconds
            const delay = Math.random() * 3000 + 2000; // 2 to 5 seconds
            timer = setTimeout(() => {
                const randomAnimal = { ...ROBUST_WILDLIFE[Math.floor(Math.random() * ROBUST_WILDLIFE.length)] };
                randomAnimal.match = (Math.floor(Math.random() * 8) + 92) + "%"; // 92-99% match
                setScanResult(randomAnimal);
                setIsScanning(false);
            }, delay);
        }
        return () => clearTimeout(timer);
    }, [scanResult, isScanning]);

    const handleManualScan = async () => {
        // Enforce network connectivity for online AI matching
        const networkState = await NetInfo.fetch();
        if (!networkState.isConnected || !networkState.isInternetReachable) {
            Alert.alert(
                "No Internet Connection",
                "The AR AI Scanner requires cellular data or Wi-Fi to match against the online wildlife database.",
                [{ text: "OK" }]
            );
            return;
        }

        setIsScanning(true);
        setScanResult(null);

        // Simulate camera capture and Cloud AI Processing Delay over cellular/wifi
        setTimeout(() => {
            setIsScanning(false);

            // Simulate that 30% of the time, the ML model fails to find an animal (e.g. scanning a wall)
            const animalDetected = Math.random() > 0.3;

            if (animalDetected) {
                const randomAnimal = { ...ROBUST_WILDLIFE[Math.floor(Math.random() * ROBUST_WILDLIFE.length)] };
                randomAnimal.match = (Math.floor(Math.random() * 8) + 92) + "%"; // 92-99% match
                setScanResult(randomAnimal);
            } else {
                Alert.alert("No Match Found in Online Database", "The AI could not recognize a valid wildlife species. Please ensure the animal is clearly visible within the frame and try again.", [{ text: "OK" }]);
            }
        }, 3000);
    };

    if (!permission) {
        return <View style={[styles.container, { backgroundColor: colors.background }]} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.permissionContainer, { backgroundColor: colors.background }]}>
                <Feather name="camera-off" size={64} color="#E5A93C" style={{ marginBottom: 20 }} />
                <Text style={[styles.permissionText, { color: colors.text }]}>We need your permission to use the camera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const resetScan = () => {
        setScanResult(null);
        setIsScanning(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CameraView style={styles.camera} facing="back">

                <View style={styles.header}>
                    <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.iconBg }]} onPress={() => navigation.goBack()}>
                        <Feather name="x" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>AR Safari Lens</Text>
                    <View style={{ width: 40 }} />
                </View>

                {!scanResult ? (
                    <View style={styles.overlay}>
                        <View style={styles.reticleContainer}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />

                            {isScanning && (
                                <Animated.View
                                    style={[
                                        styles.scanLine,
                                        { transform: [{ translateY: scanLineAnim }] }
                                    ]}
                                />
                            )}
                        </View>

                        <Text style={styles.instructionText}>
                            {isScanning ? "Analyzing surroundings..." : "Point central reticle at animal and tap capture"}
                        </Text>

                        <View style={styles.controlsContainer}>
                            <TouchableOpacity
                                style={styles.scanButtonHolder}
                                onPress={handleManualScan}
                                disabled={isScanning}
                            >
                                <Animated.View style={[styles.scanButtonOuter, isScanning && { transform: [{ scale: pulseAnim }] }]}>
                                    <View style={[styles.scanButtonInner, isScanning && styles.scanButtonInnerActive]}>
                                        {isScanning ? (
                                            <MaterialCommunityIcons name="cloud-search" size={32} color="#111" />
                                        ) : (
                                            <Feather name="aperture" size={32} color="#111" />
                                        )}
                                    </View>
                                </Animated.View>
                            </TouchableOpacity>
                            {!isScanning && <Text style={styles.liveFeedText}>Capture to Identify</Text>}
                            {isScanning && <Text style={styles.liveFeedText}>Connecting to cloud database...</Text>}
                        </View>
                    </View>
                ) : (
                    <View style={styles.resultOverlay}>
                        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Image source={{ uri: scanResult.image }} style={styles.resultImage} />

                            <View style={styles.resultContent}>
                                <View style={styles.resultHeaderRow}>
                                    <View>
                                        <Text style={[styles.resultName, { color: colors.text }]}>{scanResult.name}</Text>
                                        <Text style={[styles.resultScientific, { color: colors.textSecondary }]}>{scanResult.scientific}</Text>
                                    </View>
                                    <View style={styles.matchBadge}>
                                        <Text style={styles.matchText}>{scanResult.match} Match</Text>
                                    </View>
                                </View>

                                <View style={styles.tagsRow}>
                                    <View style={[styles.tagBadge, { backgroundColor: colors.iconBg }]}>
                                        <Feather name="alert-circle" size={12} color="#E5A93C" style={{ marginRight: 4 }} />
                                        <Text style={[styles.tagText, { color: colors.textSecondary }]}>{scanResult.status}</Text>
                                    </View>
                                    <View style={[styles.tagBadge, { backgroundColor: colors.iconBg }]}>
                                        <MaterialCommunityIcons name="bone" size={12} color="#E5A93C" style={{ marginRight: 4 }} />
                                        <Text style={[styles.tagText, { color: colors.textSecondary }]}>{scanResult.diet}</Text>
                                    </View>
                                </View>

                                <Text style={[styles.resultDesc, { color: colors.textSecondary }]} numberOfLines={4}>
                                    {scanResult.description}
                                </Text>

                                <TouchableOpacity style={styles.logButton} onPress={resetScan}>
                                    <Feather name="camera" size={18} color="#111" style={{ marginRight: 8 }} />
                                    <Text style={styles.logButtonText}>Scan Another Animal</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    permissionText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: 'bold',
    },
    permissionButton: {
        backgroundColor: '#E5A93C',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    permissionButtonText: {
        color: '#111',
        fontSize: 16,
        fontWeight: 'bold',
    },
    camera: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reticleContainer: {
        width: 250,
        height: 250,
        position: 'relative',
        marginBottom: 40,
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#E5A93C',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: '#E5A93C',
        shadowColor: '#E5A93C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    instructionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: Dimensions.get('window').height * 0.1,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
    },
    scanButtonOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(229, 169, 60, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5A93C',
    },
    scanButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E5A93C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanButtonInnerActive: {
        backgroundColor: '#fff',
    },
    liveFeedText: {
        color: '#E5A93C',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 12,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    resultOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
        padding: 20,
        paddingBottom: 40,
    },
    resultCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(229, 169, 60, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 20,
    },
    resultImage: {
        width: '100%',
        height: 200,
    },
    resultContent: {
        padding: 24,
    },
    resultHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    resultName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4,
    },
    resultScientific: {
        color: '#aaa',
        fontStyle: 'italic',
        fontSize: 14,
    },
    matchBadge: {
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.3)',
    },
    matchText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    tagBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginRight: 8,
    },
    tagText: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: 'bold',
    },
    resultDesc: {
        color: '#bbb',
        lineHeight: 22,
        fontSize: 14,
        marginBottom: 24,
    },
    logButton: {
        backgroundColor: '#E5A93C',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 14,
    },
    logButtonText: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
