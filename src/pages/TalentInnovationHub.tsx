import { useLocale } from "@/contexts/LocaleContext";

const TalentInnovationHub = () => {
  const { t } = useLocale();
  
  return (
    <main className="min-h-screen bg-background">
      <div className="container-custom section-spacing">
        <div className="text-center">
          <h1 className="text-h1 text-foreground mb-6">{t('placeholder.talentHub.title')}</h1>
          <p className="text-body text-muted-foreground">{t('placeholder.talentHub.content')}</p>
        </div>
      </div>
    </main>
  );
};

export default TalentInnovationHub;