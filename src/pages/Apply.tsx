import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

const Apply = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/apply/wizard", { replace: true });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Devenir psychologue partenaire</span>
          </div>
          <CardTitle className="text-3xl">Rejoignez U.Psy</CardTitle>
          <CardDescription>
            Pour soumettre votre dossier d'accréditation en toute sécurité (téléversement de pièces, historique, signature),
            vous devez d'abord créer un compte ou vous connecter.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={() => navigate("/auth?redirect=/apply/wizard")}>
            Créer mon compte ou me connecter <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Vos documents sont stockés dans un espace privé chiffré accessible uniquement à vous et à l'équipe d'accréditation.
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default Apply;
