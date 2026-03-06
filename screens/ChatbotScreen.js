import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/api';

export default function ChatbotScreen({ navigation }) {
    const { colors } = useTheme();
    const [messages, setMessages] = useState([
        { id: 1, text: "Jambo! I'm Simba AI, your personal Safari Guide. Tell me, what kind of experience are you looking for? (e.g., family wildlife, luxury honeymoon, budget camping)", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showHandoff, setShowHandoff] = useState(false);
    const [waitlistStatus, setWaitlistStatus] = useState(null); // 'loading', 'success', 'error'

    const scrollViewRef = useRef();

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Mock AI Logic
        setTimeout(() => {
            let botResponse = "";
            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes('family') || lowerInput.includes('kids')) {
                botResponse = "A family safari is a wonderful choice! I recommend the 'Masai Mara Great Migration Premium Safari' as it offers kid-friendly activities. Would you like me to connect you with our reservations team to check family tent availability and exact dates?";
            } else if (lowerInput.includes('honeymoon') || lowerInput.includes('luxury')) {
                botResponse = "For a romantic luxury honeymoon, the 'Serengeti & Ngorongoro Adventure' is perfect, featuring private lodges and hot air balloons. Shall I forward your details to our premium booking agents?";
            } else if (lowerInput.includes('budget') || lowerInput.includes('cheap')) {
                botResponse = "We have great value options! The 'Tsavo East Elephant Trek' is an incredible 3-day experience. Should I place you on the priority waiting list to speak with an agent about pricing?";
            } else if (lowerInput.includes('yes') || lowerInput.includes('sure') || lowerInput.includes('please')) {
                botResponse = "Excellent! Please click the button below to forward your preferences to our live reservations team. You will be placed in a priority waiting list.";
                setShowHandoff(true);
            } else {
                botResponse = "That sounds exciting! We have many packages that fit. To get you the best custom itinerary, would you like me to connect you with one of our specialized travel agents now?";
                setShowHandoff(true);
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
            setIsTyping(false);
        }, 1500);
    };

    const handleForwardToTeam = async () => {
        setWaitlistStatus('loading');
        try {
            // Forward the entire chat context summary as 'preferences'
            const recentMsgs = messages.filter(m => m.sender === 'user').map(m => m.text).join(' | ');

            const response = await axios.post(`${API_URL}/reservations/queue`, {
                name: "Guest User",
                email: "guest@example.com",
                preferences: recentMsgs || "General Inquiry",
                packageInterest: "Chatbot Assisted Match"
            });

            if (response.data.success) {
                setWaitlistStatus('success');
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: '✅ You have been successfully added to the priority waiting list! Ticket ID: ' + response.data.request.id + '. A reservation agent will reach out to you shortly via the dashboard.',
                    sender: 'bot'
                }]);
                setShowHandoff(false);
            }
        } catch (error) {
            console.warn('Failed to join queue', error.message);
            setWaitlistStatus('error');
            setMessages(prev => [...prev, { id: Date.now(), text: '❌ Failed to connect to the reservations dashboard. Please try again later.', sender: 'bot' }]);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.iconBg }]} onPress={() => navigation.goBack()}>
                    <Feather name="chevron-down" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <MaterialCommunityIcons name="robot-outline" size={24} color={colors.primary} style={{ marginRight: 8 }} />
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Simba AI</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.chatContainer}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((msg) => (
                    <View key={msg.id} style={[styles.messageBubble, msg.sender === 'user' ? [styles.userBubble, { backgroundColor: colors.primary }] : [styles.botBubble, { backgroundColor: colors.card, borderColor: colors.border }]]}>
                        <Text style={[styles.messageText, { color: msg.sender === 'user' ? '#111' : colors.text }]}>
                            {msg.text}
                        </Text>
                    </View>
                ))}

                {isTyping && (
                    <View style={[styles.messageBubble, styles.botBubble, { backgroundColor: colors.card, borderColor: colors.border, width: 60 }]}>
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                )}

                {showHandoff && waitlistStatus !== 'loading' && waitlistStatus !== 'success' && (
                    <TouchableOpacity style={[styles.handoffButton, { backgroundColor: colors.primary }]} onPress={handleForwardToTeam}>
                        <Feather name="user-check" size={20} color="#111" style={{ marginRight: 8 }} />
                        <Text style={styles.handoffButtonText}>Connect to Reservations Team</Text>
                    </TouchableOpacity>
                )}

                {waitlistStatus === 'loading' && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Securing your priority spot...</Text>
                    </View>
                )}
            </ScrollView>

            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TextInput
                    style={[styles.textInput, { backgroundColor: colors.iconBg, color: colors.text }]}
                    placeholder="Type your message..."
                    placeholderTextColor={colors.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: inputText.trim() ? colors.primary : colors.card }]}
                    onPress={handleSend}
                    disabled={!inputText.trim()}
                >
                    <Feather name="send" size={20} color={inputText.trim() ? "#111" : colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    messageBubble: {
        maxWidth: '85%',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
    },
    userBubble: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    handoffButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 10,
        alignSelf: 'center',
        width: '90%',
    },
    handoffButtonText: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        minHeight: 48,
        maxHeight: 120,
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 14,
        fontSize: 16,
        marginRight: 12,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
