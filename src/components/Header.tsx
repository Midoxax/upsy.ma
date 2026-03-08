import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix, stripLocalePrefix } from "@/lib/i18n/utils";
import logo from "@/assets/logo.webp";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { locale, t } = useLocale();

  // Nav structure: Home | Programs ▼ | Learning | Research | About ▼
  const navigation = [
    { name: t('nav.home'), href: "/" },
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
    { name: t('nav.organizations'), href: "/services/consulting-for-organizations" },
    { name: t('nav.research'), href: "/talent-innovation-hub" },
    {
      name: t('nav.about'),
      href: "/about",
      dropdown: [
        { name: t('nav.ourStory'), href: "/about" },
        { name: t('nav.contact'), href: "/contact" },
        { name: t('nav.applyAccreditation'), href: "/apply" },
      ],
    },
    { name: t('nav.blog'), href: "/resources" },
  ];

  const isActive = (href: string) => {
    const strippedPath = stripLocalePrefix(location.pathname);
    if (href === "/" && strippedPath === "/") return true;
    if (href !== "/" && strippedPath.startsWith(href)) return true;
    return false;
  };

  return (
    <header 
      className="sticky top-0 z-50 border-b transition-colors"
      style={{
        background: 'rgba(26,26,26,0.85)',
        borderBottomColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-ring rounded-md">
            <img 
              src={logo} 
              alt="U.Psy Logo - Navigate to homepage" 
              className="h-14 w-auto transition-all duration-200"
              style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6)) brightness(1.05)' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={addLocalePrefix(item.href, locale)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "text-u-gold"
                      : "text-u-gray-200 hover:text-u-white"
                  }`}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />}
                </Link>
                {item.dropdown && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                    style={{
                      background: 'linear-gradient(180deg, rgba(30,30,30,0.98), rgba(26,26,26,0.98))',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div className="py-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={addLocalePrefix(subItem.href, locale)}
                          className="block px-4 py-2.5 text-sm text-u-gray-300 hover:text-u-gold hover:bg-white/5 transition-colors"
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

          {/* Desktop CTAs: Login | Sign Up | Find Psychologist */}
          <div className="hidden lg:flex items-center space-x-3">
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
                  className="text-sm text-u-gray-200 hover:text-u-white transition-colors px-3 py-2"
                >
                  {t('nav.login')}
                </Link>
                <Button variant="secondary" size="sm" asChild>
                  <Link to={addLocalePrefix('/auth', locale)}>{t('nav.signUp')}</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link to={addLocalePrefix('/psychologists', locale)}>{t('nav.findPsychologist')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-u-white hover:text-u-gray-300 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={addLocalePrefix(item.href, locale)}
                    onClick={() => !item.dropdown && setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between text-sm font-medium transition-colors hover:text-u-white py-2 ${
                      isActive(item.href) ? "text-u-gold" : "text-u-gray-300"
                    }`}
                  >
                    {item.name}
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-4 space-y-2 mt-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={addLocalePrefix(subItem.href, locale)}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-sm text-u-gray-300 hover:text-u-white py-1.5"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col space-y-3 pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <LanguageSwitcher className="pb-3" />
                {user ? (
                  <Button variant="primary" size="sm" asChild>
                    <Link to={addLocalePrefix('/my-space', locale)} onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      {t('nav.mySpace')}
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" size="sm" asChild>
                      <Link to={addLocalePrefix('/psychologists', locale)} onClick={() => setIsMobileMenuOpen(false)}>
                        Find Psychologist
                      </Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to={addLocalePrefix('/auth', locale)} onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
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
