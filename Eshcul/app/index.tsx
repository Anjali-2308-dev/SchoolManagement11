import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const unstable_settings = {
  headerShown: false,
};

export default function LoginPage() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initializeCredentials = async () => {
      // Check if credentials are already stored
      const existingAdmission = await AsyncStorage.getItem('admissionNumber');
      const existingPassword = await AsyncStorage.getItem('password');

      if (!existingAdmission || !existingPassword) {
        // Save default credentials (ONLY ONCE)
        await AsyncStorage.setItem('admissionNumber', '12345');
        await AsyncStorage.setItem('password', 'mypassword');
      }

      // Load stored credentials
      const storedAdmission = await AsyncStorage.getItem('admissionNumber');
      const storedPassword = await AsyncStorage.getItem('password');

      setStoredCredentials({
        admissionNumber: storedAdmission,
        password: storedPassword,
      });
    };

    initializeCredentials();
  }, []);

  const handleSignIn = () => {
    if (
      admissionNumber === storedCredentials?.admissionNumber &&
      password === storedCredentials?.password
    ) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Login Failed', 'Invalid admission number or password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/school-bg.gif')}
        style={styles.backgroundGif}
        resizeMode="cover"
      />
      <View style={styles.vectorContainer}>
        <Image
          source={require('../assets/school-vector.png')}
          style={styles.vectorImage}
          resizeMode="cover"
        />
        <BlurView intensity={50} style={StyleSheet.absoluteFill} />
      </View>
      <View style={styles.overlay}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.label}>Admission Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Admission Number"
            placeholderTextColor="#aaa"
            value={admissionNumber}
            onChangeText={setAdmissionNumber}
            autoCapitalize="none"
          />
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => Alert.alert('Reset instructions sent!')}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGif: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.18,
    position: 'absolute',
    zIndex: 0,
  },
  vectorContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vectorImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    paddingTop: 80,
    zIndex: 2,
  },
  logo: {
    width: 190,
    height: 190,
    marginBottom: 10,
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#008080',
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderColor: '#008080',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#008080',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    height: 48,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
  forgot: {
    color: '#008080',
    textAlign: 'right',
    marginBottom: 12,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});