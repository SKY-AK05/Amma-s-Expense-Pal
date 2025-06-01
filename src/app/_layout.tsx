import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useFonts, PTSans_400Regular, PTSans_700Bold } from '@expo-google-fonts/pt-sans';
import {
  NotoSerifTamil_400Regular,
  NotoSerifTamil_700Bold
} from '@expo-google-fonts/noto-serif';
import { I18nProvider } from '@/contexts/i18n-context';

export default function Layout() {
  const colorScheme = useColorScheme();
  
  const [fontsLoaded] = useFonts({
    PTSans_400Regular,
    PTSans_700Bold,
    NotoSerifTamil_400Regular,
    NotoSerifTamil_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <I18nProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
          }}
        />
      </I18nProvider>
    </PaperProvider>
  );
}