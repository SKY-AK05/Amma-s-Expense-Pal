import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button, FAB, Portal, useTheme, List, IconButton, Menu } from 'react-native-paper';
import { useI18n } from '@/contexts/i18n-context';
import { useExpenses } from '@/hooks/use-expenses';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';

export default function ExpensesScreen() {
  const { t } = useI18n();
  const theme = useTheme();
  const { expenses, deleteExpense } = useExpenses();
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {expenses.map((expense) => (
          <Card key={expense.id} style={styles.expenseCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.expenseHeader}>
                <View>
                  <Text variant="titleMedium">
                    {formatCurrency(expense.amount)}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
                    {format(parseISO(expense.date), 'PPP')}
                  </Text>
                </View>
                <Menu
                  visible={menuVisible === expense.id}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={() => setMenuVisible(expense.id)}
                    />
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      router.push(`/expenses/edit/${expense.id}`);
                      setMenuVisible(null);
                    }}
                    title={t('modifyButtonLabel')}
                    leadingIcon="pencil"
                  />
                  <Menu.Item
                    onPress={() => {
                      deleteExpense(expense.id);
                      setMenuVisible(null);
                    }}
                    title={t('deleteButtonLabel')}
                    leadingIcon="delete"
                  />
                </Menu>
              </View>
              <List.Item
                title={t(`category${expense.category}`)}
                description={expense.notes}
                left={props => {
                  const icons = {
                    daily: 'food',
                    creditCard: 'credit-card',
                    special: 'gift',
                  };
                  return <List.Icon {...props} icon={icons[expense.category]} />;
                }}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <Portal>
        <FAB
          icon="plus"
          label={t('expensesAddNewButton')}
          onPress={() => router.push('/expenses/new')}
          style={[
            styles.fab,
            { backgroundColor: theme.colors.primary }
          ]}
        />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  expenseCard: {
    margin: 8,
    elevation: 2,
  },
  cardContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});