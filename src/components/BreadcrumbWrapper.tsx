import { useLocation, Link } from "react-router-dom";
import { 
  Home, Info, Briefcase, Building, Users, User, Sparkles, 
  Award, Mail, MessageCircle, Lightbulb, BookOpen, FileText, 
  LogIn, LayoutDashboard, ChevronLeft 
} from "lucide-react";
import { 
  Breadcrumb, BreadcrumbList, BreadcrumbItem, 
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, { label: string; icon: any; color: string }> = {
  '/': { label: 'Home', icon: Home, color: 'text-u-gray-400' },
  '/about': { label: 'About Us', icon: Info, color: 'text-u-gold' },
  '/services': { label: 'Services', icon: Briefcase, color: 'text-u-teal' },
  '/services/consulting-for-organizations': { label: 'For Organizations', icon: Building, color: 'text-u-maroon' },
  '/psychologists': { label: 'Find Psychologist', icon: Users, color: 'text-u-gold' },
  '/get-matched': { label: 'Get Matched', icon: Sparkles, color: 'text-u-gold' },
  '/apply': { label: 'Accreditation', icon: Award, color: 'text-u-teal' },
  '/contact': { label: 'Contact', icon: Mail, color: 'text-u-gold' },
  '/skool': { label: 'Community', icon: MessageCircle, color: 'text-u-teal' },
  '/talent-innovation-hub': { label: 'Innovation Hub', icon: Lightbulb, color: 'text-u-maroon' },
  '/resources': { label: 'Resources', icon: BookOpen, color: 'text-u-gold' },
  '/legal': { label: 'Legal', icon: FileText, color: 'text-u-gray-400' },
  '/auth': { label: 'Login', icon: LogIn, color: 'text-u-gray-400' },
  '/my-space': { label: 'My Space', icon: LayoutDashboard, color: 'text-u-gold' },
};

export function BreadcrumbWrapper() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Don't show breadcrumbs on home page or 404
  if (location.pathname === '/' || location.pathname === '/404') {
    return null;
  }

  const getBreadcrumbs = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', href: '/', icon: Home, color: 'text-u-gray-400' }];
    
    segments.forEach((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const config = breadcrumbMap[path] || { 
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '), 
        icon: FileText,
        color: 'text-u-gray-400'
      };
      crumbs.push({ ...config, href: path });
    });
    
    return crumbs;
  };

  const crumbs = getBreadcrumbs();
  const visibleCrumbs = isMobile && crumbs.length > 2 ? crumbs.slice(-2) : crumbs;
  const showBackButton = isMobile && crumbs.length > 1;
  const backLink = crumbs.length > 1 ? crumbs[crumbs.length - 2].href : '/';

  return (
    <div className="bg-u-bg border-b border-u-gray-700/30">
      <div className="container-custom pt-4 pb-8">
        <Breadcrumb>
          <BreadcrumbList>
            {showBackButton && (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={backLink} className="flex items-center gap-1 text-u-gray-400 hover:text-u-gold transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            
            {visibleCrumbs.map((crumb, index) => {
              const Icon = crumb.icon;
              const isLast = index === visibleCrumbs.length - 1;
              
              return (
                <div key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && !showBackButton && (
                    <BreadcrumbSeparator className="text-u-gray-600" />
                  )}
                  {index > 0 && showBackButton && index === 0 && (
                    <BreadcrumbSeparator className="text-u-gray-600" />
                  )}
                  
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="flex items-center gap-1.5 text-u-gray-100 font-semibold">
                        <Icon className="w-4 h-4" strokeWidth={2} />
                        <span className={cn("w-1.5 h-1.5 rounded-full", crumb.color.replace('text-', 'bg-'))} />
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href} className="flex items-center gap-1.5 text-u-gray-400 hover:text-u-gold transition-colors">
                          <Icon className="w-4 h-4" strokeWidth={2} />
                          <span className={cn("w-1.5 h-1.5 rounded-full", crumb.color.replace('text-', 'bg-'))} />
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
