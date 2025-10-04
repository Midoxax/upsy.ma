import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.webp";
import { MegaMenu } from "@/components/MegaMenu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    {
      name: "Services",
      href: "/services",
      dropdown: [
        { name: "Individual Guidance", href: "/services#individual" },
        { name: "Sport Psychology", href: "/services#sport" },
        { name: "Clinical Psychology", href: "/services#clinical" },
        { name: "Organizational Consulting", href: "/services#organizations" },
        { name: "Training & Talks", href: "/services#training" },
      ],
    },
    { name: "Find Psychologist", href: "/psychologists" },
    { name: "Get Matched", href: "/get-matched" },
    {
      name: "About",
      href: "/about",
      dropdown: [
        { name: "Our Story", href: "/about" },
        { name: "Apply for Accreditation", href: "/apply" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      name: "Resources",
      href: "/resources",
      dropdown: [
        { name: "Skool Community", href: "/skool" },
        { name: "Innovation Hub", href: "/talent-innovation-hub" },
        { name: "Legal", href: "/legal" },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-u-surface/95 backdrop-blur-lg border-b border-u-gray-700/50 shadow-u-card">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-accent rounded-md">
            <img 
              src={logo} 
              alt="U.Psy Logo - Navigate to homepage" 
              className="h-10 w-auto transition-all duration-300"
              style={{ 
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 12px rgba(255, 195, 0, 0.5)) brightness(1.1)',
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center relative">
            <Button
              variant="ghost"
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className="text-u-gray-100 hover:text-u-gold hover:bg-u-gray-700/50 transition-colors font-semibold"
              aria-expanded={megaMenuOpen}
              aria-haspopup="true"
              aria-label="Open main menu"
            >
              Explore U.Psy
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
            </Button>
            <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <Button variant="primary" size="sm" asChild>
                <Link to="/my-space">
                  <User className="mr-2 h-4 w-4" />
                  My Space
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="primary" size="sm" asChild className="hover-glow">
                  <Link to="/contact">Get Started</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/auth">Login</Link>
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
          <div className="lg:hidden py-4 border-t border-u-gray-500">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => !item.dropdown && setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between text-sm font-medium transition-colors hover:text-u-white py-2 ${
                      isActive(item.href) ? "text-u-white" : "text-u-gray-300"
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
                          to={subItem.href}
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
              <div className="flex flex-col space-y-3 pt-4 mt-4 border-t border-u-gray-500">
                {user ? (
                  <Button variant="primary" size="sm" asChild>
                    <Link to="/my-space" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      My Space
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" size="sm" asChild>
                      <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
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