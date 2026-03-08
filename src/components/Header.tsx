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

  const navigation = [
    {
      name: t('nav.services'),
      href: "/services",
      dropdown: [
        { name: t('nav.findPsychologist'), href: "/psychologists" },
        { name: t('nav.getMatched'), href: "/get-matched" },
        { name: t('nav.individualServices'), href: "/services" },
        { name: t('nav.forOrganizations'), href: "/services/consulting-for-organizations" },
      ],
    },
    {
      name: t('nav.about'),
      href: "/about",
      dropdown: [
        { name: t('nav.ourStory'), href: "/about" },
        { name: t('nav.contact'), href: "/contact" },
        { name: t('nav.applyAccreditation'), href: "/apply" },
      ],
    },
    {
      name: t('nav.community'),
      href: "/resources",
      dropdown: [
        { name: t('nav.resources'), href: "/resources" },
        { name: t('nav.skoolCommunity'), href: "/skool" },
        { name: t('nav.innovationHub'), href: "/talent-innovation-hub" },
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
    <header className="sticky top-0 z-50 bg-u-surface/80 backdrop-blur-xl border-b border-u-gray-100 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
            <img
              src={logo}
              alt="U.Psy Logo - Navigate to homepage"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={addLocalePrefix(item.href, locale)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-u-lavender-light"
                      : "text-u-gray-600 hover:text-primary hover:bg-u-gray-50"
                  }`}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />}
                </Link>
                {item.dropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-u-surface backdrop-blur-xl border border-u-gray-100 rounded-xl shadow-u-elevated opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={addLocalePrefix(subItem.href, locale)}
                          className="block px-4 py-2.5 text-sm text-u-gray-500 hover:text-primary hover:bg-u-lavender-light/50 transition-colors"
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
          <div className="hidden lg:flex items-center space-x-3">
            <LanguageSwitcher className="mr-2" />
            {user ? (
              <Button variant="primary" size="sm" asChild>
                <Link to={addLocalePrefix('/my-space', locale)}>
                  <User className="mr-2 h-4 w-4" />
                  {t('nav.mySpace')}
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="primary" size="sm" asChild>
                  <Link to={addLocalePrefix('/contact', locale)}>{t('cta.getStarted')}</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={addLocalePrefix('/auth', locale)}>{t('cta.login')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-u-gray-600 hover:text-u-navy transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-u-gray-100">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={addLocalePrefix(item.href, locale)}
                    onClick={() => !item.dropdown && setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between text-sm font-medium transition-colors py-2.5 px-3 rounded-lg ${
                      isActive(item.href) ? "text-primary bg-u-lavender-light" : "text-u-gray-600 hover:bg-u-gray-50"
                    }`}
                  >
                    {item.name}
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={addLocalePrefix(subItem.href, locale)}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-sm text-u-gray-400 hover:text-primary py-2 px-3 rounded-lg hover:bg-u-gray-50"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col space-y-3 pt-4 mt-4 border-t border-u-gray-100">
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
                      <Link to={addLocalePrefix('/contact', locale)} onClick={() => setIsMobileMenuOpen(false)}>
                        {t('cta.getStarted')}
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={addLocalePrefix('/auth', locale)} onClick={() => setIsMobileMenuOpen(false)}>
                        {t('cta.login')}
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
