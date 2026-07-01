import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import AuthService from '../services/AuthService';
import { APP, LICENCE } from '../constants';

export default function SettingsScreen() {
  const [biometric, setBiometric] = useState(false);
  const [autoBackup, setAutoBackup] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            // Navigation vers Login
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Paramètres</Text>
        <Text style={styles.subtitle}>Configuration de l'application</Text>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Sécurité</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Authentification biométrique</Text>
          <Switch
            value={biometric}
            onValueChange={setBiometric}
            trackColor={{ false: '#CCC', true: '#1565C0' }}
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Code PIN</Text>
          <TouchableOpacity>
            <Text style={styles.settingAction}>Modifier</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>💾 Sauvegarde</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Sauvegarde automatique</Text>
          <Switch
            value={autoBackup}
            onValueChange={setAutoBackup}
            trackColor={{ false: '#CCC', true: '#1565C0' }}
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Exporter les données</Text>
          <TouchableOpacity>
            <Text style={styles.settingAction}>Exporter</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Informations</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>{APP.VERSION}</Text>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Licence</Text>
          <Text style={styles.settingValue}>
            {LICENCE.PRICE} {LICENCE.CURRENCY}/mois
          </Text>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Support</Text>
          <TouchableOpacity>
            <Text style={styles.settingAction}>📧 {APP.SUPPORT_EMAIL}</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Button
        title="🚪 Se déconnecter"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#0A1628',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#64B5F6',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 14,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
  },
  settingAction: {
    fontSize: 14,
    color: '#1565C0',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
});
