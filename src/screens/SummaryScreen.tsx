import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useI18n } from '@/contexts/i18n-context';
import { useExpenses } from '@/hooks/use-expenses';
import { PieChart } from 'react-native-svg-charts';

export default function SummaryScreen() {
  const { t } = useI18n();
  const theme = useTheme();
  const { expenses } = useExpenses();

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryTotals).map(([category, amount], index) => ({
    value: amount,
    svg: {
      fill: [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary][index],
    },
    key: category,
  }));

  const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title title={t('monthlyOverviewTitle')} />
        <Card.Content>
          <Text variant="headlineMedium" style={styles.totalAmount}>
            {formatCurrency(totalExpenses)}
          </Text>
          {pieData.length > 0 ? (
            <View style={styles.chartContainer}>
              <PieChart
                style={styles.chart}
                data={pieData}
                innerRadius="50%"
                padAngle={0.02}
              />
            </View>
          ) : (
            <Text style={styles.noDataText}>{t('viewExpensesNoExpenses')}</Text>
          )}
          <View style={styles.legendContainer}>
            {Object.entries(categoryTotals).map(([category, amount], index) => (
              <View key={category} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary][index] }]} />
                <View style={styles.legendText}>
                  <Text>{t(`category${category}`)}</Text>
                  <Text>{formatCurrency(amount)}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  totalAmount: {
    textAlign: 'center',
    marginVertical: 16,
  },
  chartContainer: {
    height: 200,
    marginVertical: 16,
  },
  chart: {
    height: 200,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 16,
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});