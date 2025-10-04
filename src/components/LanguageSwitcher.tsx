import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

const LanguageSwitcher = ({ compact = false, className }: LanguageSwitcherProps) => {
  const { locale, setLocale, t } = useLocale();

  const handleSwitch = (newLocale: 'en' | 'fr') => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      toast.success(t('notification.languageUpdated'));
    }
  };

  return (
    <TooltipProvider>
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
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="text-u-gray-500 opacity-50 cursor-not-allowed px-1"
              aria-disabled="true"
              aria-label="Arabic coming soon"
            >
              AR
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('languageSwitcher.arabicComingSoon')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default LanguageSwitcher;
