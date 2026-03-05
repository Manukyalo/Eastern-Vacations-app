import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, interpolate, runOnJS } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [activeForm, setActiveForm] = useState('login'); // 'login' or 'register'

  // 0 means Login is shown, 1 means Create Account is shown
  const animationValue = useSharedValue(0);

  const toggleForm = () => {
    const toRegister = isLogin;
    setIsLogin(!toRegister);

    // Set active form before animation so it's measurable
    if (toRegister) setActiveForm('register');

    animationValue.value = withTiming(toRegister ? 1 : 0, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }, (finished) => {
      if (finished && !toRegister) {
        runOnJS(setActiveForm)('login');
      }
    });
  };

  const handleAuthAction = () => {
    // Navigate straight to Packages for the demo application
    navigation.replace('Packages');
  };

  const loginStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(animationValue.value, [0, 1], [0, -width]) }
      ],
      opacity: interpolate(animationValue.value, [0, 0.3, 1], [1, 0, 0]),
      zIndex: animationValue.value < 0.5 ? 2 : 1,
    };
  });

  const registerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(animationValue.value, [0, 1], [width, 0]) }
      ],
      opacity: interpolate(animationValue.value, [0, 0.7, 1], [0, 0, 1]),
      zIndex: animationValue.value > 0.5 ? 2 : 1,
    };
  });

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2000&auto=format&fit=crop' }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Eastern Vacations</Text>
            <Text style={styles.subtitle}>Discover the Beauty of Kenya</Text>
          </View>

          <View style={styles.formContainer}>
            {/* LOGIN FORM */}
            <Animated.View style={[styles.form, loginStyle, { position: 'absolute' }]}>
              <Text style={styles.formTitle}>Welcome Back</Text>
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc" keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ccc" secureTextEntry />
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleAuthAction}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Don't have an account? </Text>
                <TouchableOpacity onPress={toggleForm} activeOpacity={0.7}>
                  <Text style={styles.switchAction}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* REGISTER FORM */}
            <Animated.View style={[styles.form, registerStyle, { position: 'absolute' }]}>
              <Text style={styles.formTitle}>Create Account</Text>
              <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#ccc" />
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc" keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ccc" secureTextEntry />

              <TouchableOpacity style={styles.button} onPress={handleAuthAction}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Already have an account? </Text>
                <TouchableOpacity onPress={toggleForm} activeOpacity={0.7}>
                  <Text style={styles.switchAction}>Login here</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  formContainer: {
    height: 420,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  form: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    width: width - 40, // Account for parent padding
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#f0f0f0',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#E5A93C', // Premium custom gold
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#E5A93C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  switchText: {
    color: '#f0f0f0',
    fontSize: 15,
  },
  switchAction: {
    color: '#E5A93C',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
