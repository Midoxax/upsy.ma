import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Locale } from '@/lib/i18n/utils';

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

const LanguageSwitcher = ({ compact = false, className }: LanguageSwitcherProps) => {
  const { locale, setLocale, t } = useLocale();

  const handleSwitch = (newLocale: Locale) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      toast.success(t('notification.languageUpdated'));
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-2",
      compact ? "text-xs" : "text-sm",
      className
    )}>
      <button
        onClick={() => handleSwitch('en')}
        className={cn(
          "transition-colors focus:outline-none focus:ring-2 focus:ring-u-gold focus:ring-offset-2 focus:ring-offset-u-surface rounded px-1",
          locale === 'en'
            ? "text-u-white font-semibold"
            : "text-u-gray-300 hover:text-u-gold"
        )}
        aria-pressed={locale === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-u-gray-600">|</span>
      <button
        onClick={() => handleSwitch('fr')}
        className={cn(
          "transition-colors focus:outline-none focus:ring-2 focus:ring-u-gold focus:ring-offset-2 focus:ring-offset-u-surface rounded px-1",
          locale === 'fr'
            ? "text-u-white font-semibold"
            : "text-u-gray-300 hover:text-u-gold"
        )}
        aria-pressed={locale === 'fr'}
        aria-label="Switch to French"
      >
        FR
      </button>
      <span className="text-u-gray-600">|</span>
      <button
        onClick={() => handleSwitch('ar')}
        className={cn(
          "transition-colors focus:outline-none focus:ring-2 focus:ring-u-gold focus:ring-offset-2 focus:ring-offset-u-surface rounded px-1",
          locale === 'ar'
            ? "text-u-white font-semibold"
            : "text-u-gray-300 hover:text-u-gold"
        )}
        aria-pressed={locale === 'ar'}
        aria-label="Switch to Arabic"
      >
        AR
      </button>
      <span className="text-u-gray-600">|</span>
      <button
        onClick={() => handleSwitch('ber')}
        className={cn(
          "transition-colors focus:outline-none focus:ring-2 focus:ring-u-gold focus:ring-offset-2 focus:ring-offset-u-surface rounded px-1",
          locale === 'ber'
            ? "text-u-white font-semibold"
            : "text-u-gray-300 hover:text-u-gold"
        )}
        aria-pressed={locale === 'ber'}
        aria-label="ⵜⴰⵎⴰⵣⵉⵖⵜ — Switch to Amazigh"
      >
        ⵜⵎⵣ
      </button>
    </div>
  );
};

export default LanguageSwitcher;
