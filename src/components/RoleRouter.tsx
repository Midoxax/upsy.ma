import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

/**
 * Redirects /dashboard to the role-specific dashboard route.
 * Falls back to /auth if not signed in.
 */
const RoleRouter = () => {
  const { user, loading: authLoading } = useAuth();
  const { primaryRole, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  switch (primaryRole) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "psychologist":
      return <Navigate to="/dashboard/specialist" replace />;
    case "organization":
      return <Navigate to="/dashboard/organization" replace />;
    case "athlete":
    case "coach":
      return <Navigate to="/athlete-hub" replace />;
    case "user":
    default:
      return <Navigate to="/dashboard/client" replace />;
  }
};

export default RoleRouter;
