import type { Language, Translations } from '@/types';
import { en } from './en';
import { ta } from './ta';
import { hi } from './hi';

export const translations: Record<Language, Translations> = {
  en,
  ta,
  hi,
};

export const defaultLang: Language = 'en';
