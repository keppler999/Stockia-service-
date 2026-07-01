import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthService from '../services/AuthService';

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const user = await AuthService.login(username, password);
      if (user) {
        const hasBio = await AuthService.isBiometricAvailable();
        if (hasBio) {
          Alert.alert(
            '🔐 Sécurité',
            'Activer la biométrie ?',
            [
              { text: 'Plus tard', onPress: () => navigation.replace('MainTabs') },
              {
                text: 'Oui',
                onPress: async () => {
                  const ok = await AuthService.authenticateWithBiometric();
                  if (ok) navigation.replace('MainTabs');
                  else navigation.replace('MainTabs');
                },
              },
            ]
          );
        } else {
          navigation.replace('MainTabs');
        }
      } else {
        Alert.alert('Erreur', 'Identifiants incorrects');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Connexion impossible');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.title}>Stockia</Text>
        <Text style={styles.subtitle}>Gestion Commerciale</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Nom d'utilisateur"
          placeholder="Entrez votre nom"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <Input
          label="Mot de passe"
          placeholder="Entrez votre mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title={loading ? 'Connexion...' : 'Se connecter'}
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
        />

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => Alert.alert('Info', 'Contactez le support')}
        >
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024-2025 Spirale Agence
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64B5F6',
    letterSpacing: 4,
    marginTop: 4,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  loginButton: {
    marginTop: 16,
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotText: {
    color: '#64B5F6',
    fontSize: 14,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#546E7A',
    fontSize: 12,
  },
});
