import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

interface Stats {
  revenue: { today: number; week: number; month: number };
  sales: { today: number; week: number; month: number };
  stock: { total: number; low: number };
  clients: { total: number; new: number };
}

export default function DashboardScreen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // Simuler le chargement des stats
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStats({
      revenue: { today: 245000, week: 1250000, month: 5200000 },
      sales: { today: 12, week: 67, month: 280 },
      stock: { total: 156, low: 8 },
      clients: { total: 89, new: 5 },
    });
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du tableau de bord..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>📊 Tableau de bord</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('fr-FR')}</Text>
      </View>

      {/* Revenus */}
      <Card style={styles.revenueCard}>
        <Text style={styles.cardTitle}>💰 Revenus</Text>
        <View style={styles.revenueRow}>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Aujourd'hui</Text>
            <Text style={styles.revenueValue}>{formatCurrency(stats?.revenue.today || 0)}</Text>
          </View>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Cette semaine</Text>
            <Text style={styles.revenueValue}>{formatCurrency(stats?.revenue.week || 0)}</Text>
          </View>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Ce mois</Text>
            <Text style={styles.revenueValue}>{formatCurrency(stats?.revenue.month || 0)}</Text>
          </View>
        </View>
      </Card>

      {/* Statistiques */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>📦</Text>
          <Text style={styles.statValue}>{stats?.stock.total || 0}</Text>
          <Text style={styles.statLabel}>Produits</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>📉</Text>
          <Text style={styles.statValue}>{stats?.stock.low || 0}</Text>
          <Text style={styles.statLabel}>Stock bas</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>👥</Text>
          <Text style={styles.statValue}>{stats?.clients.total || 0}</Text>
          <Text style={styles.statLabel}>Clients</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>🆕</Text>
          <Text style={styles.statValue}>{stats?.clients.new || 0}</Text>
          <Text style={styles.statLabel}>Nouveaux</Text>
        </Card>
      </View>

      {/* Ventes */}
      <Card style={styles.salesCard}>
        <Text style={styles.cardTitle}>📈 Ventes</Text>
        <View style={styles.salesRow}>
          <View style={styles.salesItem}>
            <Text style={styles.salesLabel}>Aujourd'hui</Text>
            <Text style={styles.salesValue}>{stats?.sales.today || 0}</Text>
          </View>
          <View style={styles.salesItem}>
            <Text style={styles.salesLabel}>Cette semaine</Text>
            <Text style={styles.salesValue}>{stats?.sales.week || 0}</Text>
          </View>
          <View style={styles.salesItem}>
            <Text style={styles.salesLabel}>Ce mois</Text>
            <Text style={styles.salesValue}>{stats?.sales.month || 0}</Text>
          </View>
        </View>
      </Card>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 14,
    color: '#64B5F6',
    marginTop: 4,
  },
  revenueCard: {
    margin: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  revenueItem: {
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 12,
    color: '#999',
  },
  revenueValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    margin: 8,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statEmoji: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A1628',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  salesCard: {
    margin: 16,
    marginTop: 8,
  },
  salesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  salesItem: {
    alignItems: 'center',
  },
  salesLabel: {
    fontSize: 12,
    color: '#999',
  },
  salesValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 4,
  },
});
