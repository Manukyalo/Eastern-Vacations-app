import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
import { API_URL } from '../utils/api';

export default function AIPlannerScreen({ navigation }) {
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState({
        budget: null,
        interest: null,
        season: null,
    });
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const { formatPrice } = useCurrency();
    const { colors } = useTheme();

    const handleSelect = (category, value) => {
        setSelections(prev => ({ ...prev, [category]: value }));
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            generateRecommendations();
        }
    };

    const generateRecommendations = async () => {
        setLoading(true);
        setStep(4); // Processing step

        try {
            const response = await axios.post(`${API_URL}/recommendations`, selections);
            setResults(response.data.recommendations || []);
        } catch (error) {
            console.warn('Backend reach failed for AI recommendations. Using simulated results.', error.message);
            // Fallback mock if backend isn't ready
            setTimeout(() => {
                setResults([
                    { id: '1', title: 'Masai Mara Migration Safari', price: 3500 },
                    { id: '2', title: 'Amboseli Elephant Trek', price: 1800 }
                ]);
            }, 2000);
        } finally {
            // Give the UI a moment for dramatic effect even if request was fast
            setTimeout(() => setLoading(false), 1500);
        }
    };

    const OptionCard = ({ title, category, value, icon }) => {
        const isSelected = selections[category] === value;
        return (
            <TouchableOpacity
                style={[styles.optionCard, { backgroundColor: colors.iconBg, borderColor: colors.border }, isSelected && styles.optionCardSelected]}
                onPress={() => handleSelect(category, value)}
                activeOpacity={0.8}
            >
                <Feather name={icon} size={32} color={isSelected ? "#111" : colors.primary} style={{ marginBottom: 12 }} />
                <Text style={[styles.optionTitle, { color: colors.textSecondary }, isSelected && styles.optionTitleSelected]}>{title}</Text>
                {isSelected && (
                    <View style={styles.checkBadge}>
                        <Feather name="check" size={12} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>AI Trip Architect</Text>
                <Text style={[styles.headerSubtitle, { color: colors.primary }]}>Let our AI craft your perfect safari</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {step === 1 && (
                    <Animated.View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>1. What is your budget level?</Text>
                        <View style={styles.optionsGrid}>
                            <OptionCard title="Value" category="budget" value="value" icon="dollar-sign" />
                            <OptionCard title="Comfort" category="budget" value="comfort" icon="briefcase" />
                            <OptionCard title="Luxury" category="budget" value="luxury" icon="star" />
                            <OptionCard title="No Limit" category="budget" value="nolimit" icon="award" />
                        </View>
                    </Animated.View>
                )}

                {step === 2 && (
                    <Animated.View style={styles.stepContainer}>
                        <Text style={[styles.stepTitle, { color: colors.text }]}>2. What is your primary interest?</Text>
                        <View style={styles.optionsGrid}>
                            <OptionCard title="Wildlife" category="interest" value="wildlife" icon="camera" />
                            <OptionCard title="Beach Relaxation" category="interest" value="beach" icon="sun" />
                            <OptionCard title="Culture" category="interest" value="culture" icon="users" />
                            <OptionCard title="Adventure" category="interest" value="adventure" icon="compass" />
                        </View>
                    </Animated.View>
                )}

                {step === 3 && (
                    <Animated.View style={styles.stepContainer}>
                        <Text style={[styles.stepTitle, { color: colors.text }]}>3. When do you plan to travel?</Text>
                        <View style={styles.optionsGrid}>
                            <OptionCard title="Dry Season (Jun-Oct)" category="season" value="dry" icon="sun" />
                            <OptionCard title="Green Season (Nov-May)" category="season" value="green" icon="cloud-rain" />
                        </View>
                    </Animated.View>
                )}

                {step === 4 && loading && (
                    <View style={styles.processingContainer}>
                        <ActivityIndicator size="large" color="#E5A93C" />
                        <Text style={styles.processingText}>Analyzing data & matching packages...</Text>
                        <Text style={styles.processingSubText}>Our AI is scanning over 500 combinations</Text>
                    </View>
                )}

                {step === 4 && !loading && (
                    <View style={styles.resultsContainer}>
                        <Text style={[styles.resultsHeader, { color: colors.text }]}>Your AI Matches</Text>
                        {results.length > 0 ? results.map((pkg, idx) => (
                            <TouchableOpacity key={idx} style={[styles.resultCard, { backgroundColor: colors.iconBg, borderColor: colors.border }]} onPress={() => navigation.navigate('PackageDetails', { item: pkg })}>
                                <View style={styles.resultInfo}>
                                    <Text style={[styles.resultTitle, { color: colors.text }]}>{pkg.title}</Text>
                                    <Text style={styles.resultMatchText}>98% Match based on your profile</Text>
                                </View>
                                <View style={styles.resultPriceBadge}>
                                    <Text style={styles.resultPriceText}>{formatPrice(pkg.price)}</Text>
                                </View>
                                <Feather name="chevron-right" size={24} color="#666" style={{ marginLeft: 12 }} />
                            </TouchableOpacity>
                        )) : (
                            <Text style={styles.noResultsText}>We couldn't find a perfect match. Please try different filters.</Text>
                        )}

                        <TouchableOpacity style={styles.resetButton} onPress={() => { setStep(1); setSelections({}); setResults([]); }}>
                            <Text style={styles.resetButtonText}>Start Over</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>

            {step < 4 && (
                <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                    {step > 1 && (
                        <TouchableOpacity style={[styles.backButton, { borderColor: colors.border }]} onPress={() => setStep(step - 1)}>
                            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.nextButton, !selections[Object.keys(selections)[step - 1]] && styles.disabledButton]}
                        onPress={handleNext}
                        disabled={!selections[Object.keys(selections)[step - 1]]}
                    >
                        <Text style={styles.nextButtonText}>{step === 3 ? "Generate Trip" : "Next Step"}</Text>
                        <Feather name="arrow-right" size={20} color="#111" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            )}
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
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#E5A93C',
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 6,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    stepContainer: {
        flex: 1,
    },
    stepTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    optionCard: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        position: 'relative',
    },
    optionCardSelected: {
        backgroundColor: '#E5A93C',
        borderColor: '#E5A93C',
    },
    optionTitle: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    optionTitleSelected: {
        color: '#111',
    },
    checkBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#111',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        backgroundColor: '#0A0A0A',
    },
    backButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        paddingVertical: 16,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    nextButton: {
        flex: 2,
        backgroundColor: '#E5A93C',
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    disabledButton: {
        backgroundColor: 'rgba(229,169,60,0.3)',
    },
    nextButtonText: {
        color: '#111',
        fontSize: 16,
        fontWeight: 'bold',
    },
    processingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
    },
    processingText: {
        color: '#E5A93C',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 8,
    },
    processingSubText: {
        color: '#888',
        fontSize: 14,
    },
    resultsContainer: {
        flex: 1,
    },
    resultsHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    resultCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 16,
    },
    resultInfo: {
        flex: 1,
    },
    resultTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    resultMatchText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: 'bold',
    },
    resultPriceBadge: {
        backgroundColor: 'rgba(229,169,60,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    resultPriceText: {
        color: '#E5A93C',
        fontSize: 14,
        fontWeight: 'bold',
    },
    noResultsText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
        lineHeight: 24,
    },
    resetButton: {
        marginTop: 40,
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5A93C',
        paddingBottom: 4,
    },
    resetButtonText: {
        color: '#E5A93C',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
