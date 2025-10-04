import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.webp";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Find a Psychologist", href: "/psychologists" },
    { name: "Get Matched", href: "/get-matched" },
    { name: "Accreditation", href: "/accreditation" },
    { name: "Tech & R&D", href: "/tech-rd" },
    { name: "Resources", href: "/resources" },
    { name: "Skool", href: "/skool" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Talent & Innovation Hub", href: "/talent-innovation-hub" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-u-surface shadow-u-card">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-accent rounded-md">
            <img 
              src={logo} 
              alt="U.Psy Logo - Navigate to homepage" 
              className="h-10 w-auto filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.7)] transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-u-white ${
                  isActive(item.href) ? "text-u-white" : "text-u-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

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
                <Button variant="primary" size="sm" asChild>
                  <Link to="/book-a-call">Get Started</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/apply">Join Network</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/auth">Psychologist Login</Link>
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
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-u-white ${
                    isActive(item.href) ? "text-u-white" : "text-u-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4">
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
                      <Link to="/book-a-call" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/apply" onClick={() => setIsMobileMenuOpen(false)}>
                        Join Network
                      </Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        Psychologist Login
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