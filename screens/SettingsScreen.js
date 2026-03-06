import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActionSheetIOS, Platform, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsScreen() {
    const { isDarkMode, toggleTheme, colors } = useTheme();
    const { language, changeLanguage, t } = useLanguage();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'sw', name: 'Swahili' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh', name: 'Chinese' }
    ];

    const handleLanguageSelect = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: [...languages.map(l => l.name), 'Cancel'],
                    cancelButtonIndex: languages.length,
                    title: 'Select Language'
                },
                (buttonIndex) => {
                    if (buttonIndex < languages.length) {
                        changeLanguage(languages[buttonIndex].code);
                    }
                }
            );
        } else {
            const buttons = languages.map(l => ({
                text: l.name,
                onPress: () => changeLanguage(l.code)
            }));
            buttons.push({ text: 'Cancel', style: 'cancel' });
            Alert.alert('Select Language', '', buttons);
        }
    };

    const currentLangName = languages.find(l => l.code === language)?.name || 'English';

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings')}</Text>
                <Text style={[styles.headerSubtitle, { color: colors.primary }]}>Customize your app experience</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>

                <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.settingInfo}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
                            {isDarkMode ? (
                                <Feather name="moon" size={20} color={colors.primary} />
                            ) : (
                                <Feather name="sun" size={20} color={colors.primary} />
                            )}
                        </View>
                        <View>
                            <Text style={[styles.settingName, { color: colors.text }]}>{t('darkMode')}</Text>
                            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Enjoy a darker, premium aesthetic</Text>
                        </View>
                    </View>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: colors.primary }}
                        thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                    />
                </View>

                {/* Notifications */}
                <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.settingInfo}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
                            <Feather name="bell" size={20} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={[styles.settingName, { color: colors.text }]}>Notifications</Text>
                            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Manage safari alerts</Text>
                        </View>
                    </View>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#767577', true: colors.primary }}
                        thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={handleLanguageSelect}
                    activeOpacity={0.7}
                >
                    <View style={styles.settingInfo}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
                            <Feather name="globe" size={20} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={[styles.settingName, { color: colors.text }]}>{t('language')}</Text>
                            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{currentLangName}</Text>
                        </View>
                    </View>
                    <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        marginTop: 6,
    },
    section: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 16,
        letterSpacing: 1,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    settingDesc: {
        fontSize: 12,
    }
});
