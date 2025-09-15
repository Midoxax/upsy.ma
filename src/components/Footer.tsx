import { Link } from "react-router-dom";
import { Youtube, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-u-surface border-t border-u-gray-500">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Bio */}
          <div className="lg:col-span-2">
            <div className="flex flex-col mb-4">
              <span className="text-u-white font-bold text-xl">U.Psy</span>
              <span className="text-u-gray-300 text-xs">by Mehdi Felji</span>
            </div>
            <p className="text-u-gray-300 text-sm mb-6">
              Evidence-based psychology & sport performance.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <p className="text-u-gray-300">
                <span className="text-u-white">Email:</span> contact@upsy.com
              </p>
              <p className="text-u-gray-300">
                <span className="text-u-white">WhatsApp:</span>{" "}
                <a href="#" className="text-u-orange hover:underline">
                  Available upon request
                </a>
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-u-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-u-gray-300 hover:text-u-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="#" 
                className="text-u-gray-300 hover:text-u-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="text-u-gray-300 hover:text-u-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-u-gray-300 hover:text-u-white transition-colors"
                aria-label="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Legal & Language */}
          <div>
            <h3 className="text-u-white font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link to="/legal" className="text-u-gray-300 hover:text-u-white text-sm block transition-colors">
                Terms & Privacy
              </Link>
              <div className="text-u-gray-300 text-sm">
                <span className="text-u-white">Language:</span> EN · FR · AR
              </div>
            </div>
          </div>
        </div>

        {/* Crisis Notice */}
        <div className="border-t border-u-gray-500 pt-8 mt-8">
          <p className="text-u-gray-300 text-xs text-center">
            <strong className="text-u-orange">Important:</strong> This is not a crisis service. 
            In an emergency, contact your local emergency services immediately.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-u-gray-500">
          <p className="text-u-gray-300 text-xs text-center">
            © {new Date().getFullYear()} U.Psy by Mehdi Felji. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;