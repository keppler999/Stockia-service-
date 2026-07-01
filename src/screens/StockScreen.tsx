import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';

const mockProducts = [
  { id: '1', name: 'Coca-Cola 33cl', barcode: '1234567890123', price: 1500, stock: 42, minStock: 10, category: 'Boissons' },
  { id: '2', name: 'Fanta Orange', barcode: '1234567890124', price: 1500, stock: 38, minStock: 10, category: 'Boissons' },
  { id: '3', name: 'Pain de mie', barcode: '1234567890125', price: 2500, stock: 5, minStock: 10, category: 'Alimentation' },
];

export default function StockScreen() {
  const [search, setSearch] = useState('');

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📦 Stock</Text>
        <Text style={styles.subtitle}>Gestion des produits</Text>
      </View>

      <View style={styles.toolbar}>
        <Input
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.searchInput}
        />
        <Button title="+ Ajouter" onPress={() => {}} size="small" />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => {}}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card>
            <Text style={styles.emptyText}>Aucun produit trouvé</Text>
          </Card>
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
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },
});
