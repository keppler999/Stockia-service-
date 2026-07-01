import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Card from './Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  subtitle?: string;
  trend?: number;
}

export default function StatsCard({
  title,
  value,
  icon,
  color = '#1565C0',
  subtitle,
  trend,
}: StatsCardProps) {
  const cardStyle: ViewStyle = {
    ...styles.card,
    borderLeftColor: color,
    borderLeftWidth: 4,
  };

  return (
    <Card style={cardStyle}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {trend !== undefined && (
        <View style={[
          styles.trend,
          trend >= 0 ? styles.trendPositive : styles.trendNegative
        ]}>
          <Text style={styles.trendText}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  trend: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  trendPositive: {
    backgroundColor: '#E8F5E9',
  },
  trendNegative: {
    backgroundColor: '#FFEBEE',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
});
