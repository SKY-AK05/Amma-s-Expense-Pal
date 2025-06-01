import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useI18n } from '@/contexts/i18n-context';
import HomeScreen from '@/screens/HomeScreen';
import ExpensesScreen from '@/screens/ExpensesScreen';
import SummaryScreen from '@/screens/SummaryScreen';
import SettingsScreen from '@/screens/SettingsScreen';

export default function TabLayout() {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: { paddingBottom: 4 },
      }}>
      <Tabs.Screen
        name="index"
        component={HomeScreen}
        options={{
          title: t('navHome'),
          tabBarLabel: t('navHome'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        component={ExpensesScreen}
        options={{
          title: t('navExpenses'),
          tabBarLabel: t('navExpenses'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        component={SummaryScreen}
        options={{
          title: t('navSummary'),
          tabBarLabel: t('navSummary'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          title: t('navSettings'),
          tabBarLabel: t('navSettings'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}