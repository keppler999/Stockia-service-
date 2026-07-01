import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { formatCurrency } from '../utils/formatters';

export default function CaisseScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💰 Caisse</Text>
        <Text style={styles.subtitle}>Enregistrement des ventes</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card>
          <Text style={styles.emptyText}>Aucun article dans le panier</Text>
          <Text style={styles.emptySub}>Scannez ou recherchez des produits</Text>
        </Card>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(0)}</Text>
        </View>

        <Button
          title="Valider la vente"
          onPress={() => {}}
          variant="success"
          disabled={items.length === 0}
        />
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
    marginTop: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
  },
});
