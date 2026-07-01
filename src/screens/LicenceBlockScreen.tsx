import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import LicenceService from '../services/LicenceService';
import { APP, LICENCE } from '../constants';

interface Props {
  navigation: any;
}

export default function LicenceBlockScreen({ navigation }: Props) {
  const [remainingDays, setRemainingDays] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    checkLicence();
  }, []);

  const checkLicence = async () => {
    const status = await LicenceService.checkLicence();
    setRemainingDays(status.remainingDays);
    setIsExpired(status.remainingDays === 0);
    
    if (status.isValid) {
      navigation.replace('MainTabs');
    }
  };

  const contactWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const message = 📱 DEMANDE D'ACTIVATION STOCKIA\n\n📌 ID: \n📌 Demande:  /mois;
    const url = https://wa.me/?text=;
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.title}>{APP.NAME}</Text>
        <Text style={styles.subtitle}>Gestion Commerciale</Text>
      </View>

      <View style={styles.blockContainer}>
        <Text style={styles.blockTitle}>
          {isExpired ? '🚫 Accès bloqué' : ⏳  jours restants}
        </Text>
        
        <Text style={styles.blockMessage}>
          {isExpired ? 'Votre abonnement a expiré' : "Période d'essai en cours"}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>📌 Abonnement</Text>
          <Text style={styles.price}>{LICENCE.PRICE} {LICENCE.CURRENCY}</Text>
          <Text style={styles.pricePeriod}>/ mois</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.whatsappButton} onPress={contactWhatsApp}>
          <Text style={styles.whatsappText}>💬 Contacter sur WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.activateButton} onPress={() => {
          Alert.prompt('🔑 Activation', 'Entrez votre code:', async (code) => {
            if (code && await LicenceService.activateLicence(code)) {
              Alert.alert('✅ Succès', 'Stockia activé !');
              navigation.replace('MainTabs');
            } else {
              Alert.alert('❌ Erreur', 'Code invalide');
            }
          });
        }}>
          <Text style={styles.activateText}>🔑 J'ai un code</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0A1628', padding: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#64B5F6', letterSpacing: 4 },
  blockContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  blockTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  blockMessage: { fontSize: 16, color: '#90CAF9', textAlign: 'center', marginVertical: 12 },
  priceContainer: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, alignItems: 'center', width: '100%' },
  priceLabel: { color: '#FFD54F', fontSize: 14, fontWeight: '600' },
  price: { fontSize: 42, fontWeight: 'bold', color: '#FFD700' },
  pricePeriod: { color: '#90CAF9', fontSize: 16 },
  actionsContainer: { gap: 12, marginTop: 20, marginBottom: 30 },
  whatsappButton: { backgroundColor: '#25D366', padding: 16, borderRadius: 12, alignItems: 'center' },
  whatsappText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  activateButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  activateText: { color: '#64B5F6', fontSize: 16, fontWeight: '600' },
});
