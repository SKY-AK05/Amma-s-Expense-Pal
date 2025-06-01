import { View, ScrollView } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { useI18n } from '@/contexts/i18n-context';
import { useExpenses } from '@/hooks/use-expenses';

export default function HomeScreen() {
  const { t } = useI18n();
  const theme = useTheme();
  const { expenses } = useExpenses();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title={t('homeExpensesSummaryTitle')} />
          <Card.Content>
            <Text variant="titleLarge">{t('homeTodayLabel')}</Text>
            <Text variant="bodyLarge">₹0</Text>
            <Text variant="titleLarge" style={{ marginTop: 8 }}>{t('homeThisMonthLabel')}</Text>
            <Text variant="bodyLarge">₹0</Text>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Card.Title title={t('homeQuickActionsTitle')} />
          <Card.Content>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={{ marginBottom: 8 }}
            >
              {t('homeAddDailyExpenseButton')}
            </Button>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={{ marginBottom: 8 }}
            >
              {t('homeAddCreditCardExpenseButton')}
            </Button>
            <Button
              mode="outlined"
              onPress={() => {}}
            >
              {t('homeAddSpecialExpenseButton')}
            </Button>
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title={t('homeRecentTransactionsTitle')} />
          <Card.Content>
            {expenses.length === 0 ? (
              <Text>{t('homeNoRecentTransactionsMessage')}</Text>
            ) : (
              // Implement expense list here
              <Text>Recent transactions will appear here</Text>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}