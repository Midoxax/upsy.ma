import { useLocale } from "@/contexts/LocaleContext";

const Skool = () => {
  const { t } = useLocale();
  
  return (
    <main className="min-h-screen bg-background">
      <div className="container-custom section-spacing">
        <div className="text-center">
          <h1 className="text-h1 text-foreground mb-6">{t('placeholder.skool.title')}</h1>
          <p className="text-body text-muted-foreground">{t('placeholder.skool.content')}</p>
        </div>
      </div>
    </main>
  );
};

export default Skool;