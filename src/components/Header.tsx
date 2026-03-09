import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ChevronDown, Umbrella } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix, stripLocalePrefix } from "@/lib/i18n/utils";
import logo from "@/assets/logo.webp";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { user } = useAuth();
  const { locale, t } = useLocale();

  // Consolidated nav: 5 items max + dropdowns
  const navigation = [
    { name: t('nav.findPsychologist'), href: "/psychologists" },
    {
      name: t('nav.programs'),
      href: "/services",
      dropdown: [
        { name: t('nav.individualServices'), href: "/services" },
        { name: t('nav.forOrganizations'), href: "/services/consulting-for-organizations" },
        { name: t('nav.getMatched'), href: "/get-matched" },
      ],
    },
    { name: t('nav.learning'), href: "/resources" },
    { name: t('nav.research'), href: "/talent-innovation-hub" },
    {
      name: t('nav.about'),
      href: "/about",
      dropdown: [
        { name: t('nav.ourStory'), href: "/about" },
        { name: "The Moroccan Umbrella", href: "/moroccan-umbrella", icon: Umbrella, featured: true },
        { name: t('nav.contact'), href: "/contact" },
        { name: t('nav.applyAccreditation'), href: "/apply" },
      ],
    },
  ];

  const isActive = (href: string) => {
    const strippedPath = stripLocalePrefix(location.pathname);
    if (href === "/" && strippedPath === "/") return true;
    if (href !== "/" && strippedPath.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md">
            <img
              src={logo}
              alt="U.Psy Logo"
              className="h-12 w-auto transition-all duration-200 dark:brightness-110"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={addLocalePrefix(item.href, locale)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/8"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />}
                </Link>
                {item.dropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="glass-effect rounded-xl border border-border/50 py-1.5 shadow-lg">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={addLocalePrefix(subItem.href, locale)}
                          className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher className="mr-1" />
            {user ? (
              <Button variant="primary" size="sm" asChild>
                <Link to={addLocalePrefix('/my-space', locale)}>
                  <User className="mr-2 h-4 w-4" />
                  {t('nav.mySpace')}
                </Link>
              </Button>
            ) : (
              <>
                <Link
                  to={addLocalePrefix('/auth', locale)}
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors px-3 py-2"
                >
                  {t('nav.login')}
                </Link>
                <Button variant="primary" size="sm" asChild>
                  <Link to={addLocalePrefix('/psychologists', locale)}>{t('nav.findPsychologist')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-muted-foreground transition-colors rounded-lg hover:bg-muted/50"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/30 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => {
                      if (item.dropdown) {
                        setOpenDropdown(openDropdown === item.name ? null : item.name);
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`flex items-center justify-between w-full text-sm font-medium transition-colors rounded-lg px-3 py-2.5 ${
                      isActive(item.href) ? "text-primary bg-primary/8" : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {!item.dropdown ? (
                      <Link
                        to={addLocalePrefix(item.href, locale)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 text-left"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span>{item.name}</span>
                    )}
                    {item.dropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  {item.dropdown && openDropdown === item.name && (
                    <div className="ml-3 pl-3 border-l-2 border-primary/20 space-y-1 mt-1 mb-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={addLocalePrefix(subItem.href, locale)}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-sm text-foreground/60 hover:text-primary py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-3 border-t border-border/30">
                <div className="flex items-center gap-3 px-3">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
                {user ? (
                  <Button variant="primary" size="sm" asChild>
                    <Link to={addLocalePrefix('/my-space', locale)} onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      {t('nav.mySpace')}
                    </Link>
                  </Button>
                ) : (
                  <div className="flex gap-2 px-3">
                    <Button variant="secondary" size="sm" asChild className="flex-1">
                      <Link to={addLocalePrefix('/auth', locale)} onClick={() => setIsMobileMenuOpen(false)}>
                        {t('nav.login')}
                      </Link>
                    </Button>
                    <Button variant="primary" size="sm" asChild className="flex-1">
                      <Link to={addLocalePrefix('/psychologists', locale)} onClick={() => setIsMobileMenuOpen(false)}>
                        {t('nav.findPsychologist')}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
