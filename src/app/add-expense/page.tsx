
'use client';

import React from 'react';
import ExpenseForm from '@/components/expense-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/contexts/i18n-context';
import { useSearchParams } from 'next/navigation';

export default function AddExpensePage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const isEditing = !!searchParams.get('edit');

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline text-center">
            {isEditing ? t('editExpenseTitle') : t('addExpenseTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm />
        </CardContent>
      </Card>
    </div>
  );
}
