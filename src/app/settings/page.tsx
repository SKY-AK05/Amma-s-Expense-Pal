'use client';

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';
import type { Language } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const { t, language, setLanguage } = useI18n();

  const languageOptions = [
    { value: 'en', label: t('settingsLanguageEnglish') },
    { value: 'ta', label: t('settingsLanguageTamil') },
    { value: 'hi', label: t('settingsLanguageHindi') },
  ];

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline text-center">{t('settingsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="language-select" className="block text-lg font-medium mb-2">
              {t('settingsLanguageLabel')}
            </Label>
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value as Language)}
            >
              <SelectTrigger id="language-select" className="input-xl select-trigger-xl">
                <SelectValue placeholder={t('selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="select-content-xl">
                {languageOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="select-item-xl">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Placeholder for future settings
          <div className="flex items-center justify-between">
            <Label htmlFor="daily-reminder" className="text-lg">Daily Reminder</Label>
            <Switch id="daily-reminder" disabled />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cloud-backup" className="text-lg">Cloud Backup</Label>
            <Switch id="cloud-backup" disabled />
          </div>
          */}
        </CardContent>
      </Card>
    </div>
  );
}
