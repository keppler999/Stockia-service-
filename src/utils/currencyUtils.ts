// ============================================
// CURRENCY UTILITIES
// ============================================

export const formatCurrency = (amount: number, currency = 'FC'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'CDF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('CDF', currency);
};

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9,.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    FC: 'FC',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CDF: 'FC',
  };
  return symbols[currency] || currency;
};

export const formatPrice = (price: number): string => {
  return formatCurrency(price);
};

export const formatDiscount = (discount: number): string => {
  return ${discount}%;
};

export const calculateTotal = (items: Array<{ quantity: number; unitPrice: number }>): number => {
  return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
};

export const calculateTax = (amount: number, rate: number): number => {
  return amount * (rate / 100);
};

export const calculateProfit = (price: number, cost: number): number => {
  return price - cost;
};

export const calculateMargin = (price: number, cost: number): number => {
  if (price === 0) return 0;
  return ((price - cost) / price) * 100;
};
