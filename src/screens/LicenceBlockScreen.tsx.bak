// ============================================
// ÉCRAN DE BLOCAGE - LICENCE
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import LicenceService from '../services/LicenceService';
import { APP, LICENCE } from '../constants';

interface LicenceBlockScreenProps {
  navigation: any;
}

export default function LicenceBlockScreen({ navigation }: LicenceBlockScreenProps) {
  const [remainingDays, setRemainingDays] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    checkLicence();
  }, []);

  const checkLicence = async () => {
    try {
      const status = await LicenceService.checkLicence();
      setRemainingDays(status.remainingDays);
      setIsExpired(status.isExpired);

      const id = await LicenceService.getDeviceId();
      setDeviceId(id);

      if (status.isValid) {
        navigation.replace('MainTabs');
      }
    } catch (error) {
      console.error('Erreur vérification licence:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contactWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const message = 📱 DEMANDE D'ACTIVATION STOCKIA

📌 Informations :
• Appareil :  - 
• ID Appareil : 
• Demande : Abonnement  /mois

📝 Message :
Bonjour, je souhaite activer mon abonnement Stockia.
Voici mon identifiant d'appareil. Merci !;

    const url = https://wa.me/?text=;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        'Erreur',
        "Impossible d'ouvrir WhatsApp. Veuillez nous contacter directement au " + LICENCE.WHATSAPP
      );
    });
  };

  const activateWithCode = () => {
    Alert.prompt(
      '🔑 Activation',
      "Entrez le code d'activation reçu par WhatsApp",
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Activer',
          onPress: async (code) => {
            if (!code || code.length < 6) {
              Alert.alert('❌ Erreur', 'Code invalide');
              return;
            }

            const success = await LicenceService.activateLicence(code);
            if (success) {
              Alert.alert('✅ Succès', 'Stockia activé pour 30 jours !');
              navigation.replace('MainTabs');
            } else {
              Alert.alert('❌ Erreur', 'Code invalide. Veuillez réessayer.');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.title}>{APP.NAME}</Text>
        <Text style={styles.subtitle}>Gestion Commerciale</Text>
        <Text style={styles.version}>v{APP.VERSION}</Text>
      </View>

      <View style={styles.blockContainer}>
        <View style={styles.lockIcon}>
          <Text style={styles.lockEmoji}>{isExpired ? '🔒' : '⏳'}</Text>
        </View>

        <Text style={styles.blockTitle}>
          {isExpired ? '🚫 Accès bloqué' : ⏳  jours restants}
        </Text>

        <Text style={styles.blockMessage}>
          {isExpired
            ? 'Votre abonnement a expiré'
            : Votre période d'essai expire dans  jours}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>📌 Abonnement</Text>
          <Text style={styles.price}>
            {LICENCE.PRICE.toLocaleString()} {LICENCE.CURRENCY}
          </Text>
          <Text style={styles.pricePeriod}>/ mois</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={contactWhatsApp}
          activeOpacity={0.8}
        >
          <Text style={styles.whatsappIcon}>💬</Text>
          <Text style={styles.whatsappText}>Contacter sur WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.activateButton}
          onPress={activateWithCode}
        >
          <Text style={styles.activateText}>🔑 J'ai déjà un code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => {
            Alert.alert(
              '📖 Comment activer ?',
              1. Contactez-nous sur WhatsApp\n +
              2. Effectuez le paiement de  \n +
              3. Recevez votre code d'activation\n +
              4. Entrez le code pour débloquer\n\n +
              📞 \n +
              📧 ,
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={styles.infoText}>❓ Comment ça marche ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.trialButton}
          onPress={async () => {
            if (!isExpired) {
              Alert.alert(
                '⚠️ Période d\'essai',
                Vous avez déjà  jours restants. Voulez-vous vraiment recommencer ?,
                [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Recommencer',
                    onPress: async () => {
                      await LicenceService.startTrial();
                      await checkLicence();
                    },
                  },
                ]
              );
            } else {
              await LicenceService.startTrial();
              await checkLicence();
            }
          }}
        >
          <Text style={styles.trialText}>🆓 Essai gratuit de {LICENCE.TRIAL_DAYS} jours</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024-2025 {APP.COMPANY}
        </Text>
        <Text style={styles.footerSub}>
          {APP.SUPPORT_EMAIL}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
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
    marginTop: 4,
    letterSpacing: 4,
  },
  version: {
    fontSize: 12,
    color: '#546E7A',
    marginTop: 8,
  },
  loading: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  blockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  lockIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  lockEmoji: {
    fontSize: 40,
  },
  blockTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  blockMessage: {
    fontSize: 16,
    color: '#90CAF9',
    textAlign: 'center',
    marginBottom: 32,
  },
  priceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  priceLabel: {
    color: '#FFD54F',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
  },
  pricePeriod: {
    color: '#90CAF9',
    fontSize: 16,
    marginTop: 2,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  whatsappButton: {
    flexDirection: 'row',
    backgroundColor: '#25D366',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  whatsappIcon: {
    fontSize: 24,
  },
  whatsappText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activateText: {
    color: '#64B5F6',
    fontSize: 16,
    fontWeight: '600',
  },
  infoButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  infoText: {
    color: '#78909C',
    fontSize: 14,
  },
  trialButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  trialText: {
    color: '#FFD54F',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: {
    color: '#546E7A',
    fontSize: 12,
  },
  footerSub: {
    color: '#37474F',
    fontSize: 10,
    marginTop: 4,
  },
});
