import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ClientService from '../services/ClientService';
import type { Client } from '../types';

export default function ClientManagementScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await ClientService.getAllClients();
      setClients(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les clients');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Client }) => (
    <Card>
      <View style={styles.clientCard}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.name}</Text>
          {item.phone && <Text style={styles.clientDetail}>📱 {item.phone}</Text>}
          {item.email && <Text style={styles.clientDetail}>📧 {item.email}</Text>}
        </View>
        <View style={styles.clientStats}>
          <Text style={styles.loyaltyPoints}>⭐ {item.loyaltyPoints} pts</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Voir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👥 Clients</Text>
        <Text style={styles.subtitle}>Gestion des clients</Text>
      </View>

      <View style={styles.toolbar}>
        <Input
          placeholder="🔍 Rechercher un client..."
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.searchInput}
        />
        <Button title="+ Ajouter" onPress={() => {}} size="small" />
      </View>

      <FlatList
        data={filteredClients}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadClients} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="👥"
            title="Aucun client"
            description="Ajoutez vos premiers clients"
          />
        }
      />
    </View>
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
  toolbar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  clientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  clientDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  clientStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  loyaltyPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
  },
  actionButton: {
    padding: 4,
  },
  actionText: {
    color: '#1565C0',
    fontSize: 12,
  },
});
