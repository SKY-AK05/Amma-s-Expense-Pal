import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, useTheme, Divider } from 'react-native-paper';
import { useI18n } from '@/contexts/i18n-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { t, language, setLanguage } = useI18n();
  const theme = useTheme();

  const languages = [
    { code: 'en', label: t('settingsLanguageEnglish') },
    { code: 'ta', label: t('settingsLanguageTamil') },
    { code: 'hi', label: t('settingsLanguageHindi') },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>{t('settingsPreferencesTitle')}</List.Subheader>
        <List.Item
          title={t('settingsLanguageLabel')}
          description={languages.find(lang => lang.code === language)?.label}
          left={props => <List.Icon {...props} icon="translate" />}
          onPress={() => {
            // Implement language selection dialog
          }}
        />
        <List.Item
          title={t('settingsDarkModeLabel')}
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => <Switch value={theme.dark} onValueChange={() => {}} />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>{t('settingsDataManagementTitle')}</List.Subheader>
        <List.Item
          title={t('settingsExportAllDataLabel')}
          left={props => <List.Icon {...props} icon="export" />}
          onPress={() => {}}
        />
        <List.Item
          title={t('settingsShareAppLabel')}
          left={props => <List.Icon {...props} icon="share" />}
          onPress={() => {}}
        />
        <List.Item
          title={t('settingsClearAllDataLabel')}
          left={props => <List.Icon {...props} icon="delete" />}
          onPress={() => {}}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>{t('settingsSupportTitle')}</List.Subheader>
        <List.Item
          title={t('settingsHelpSupportLabel')}
          left={props => <List.Icon {...props} icon="help-circle" />}
          onPress={() => {}}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});