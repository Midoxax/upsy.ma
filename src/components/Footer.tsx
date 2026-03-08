import { Link } from "react-router-dom";
import { Youtube, Linkedin, Instagram } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { addLocalePrefix } from "@/lib/i18n/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Footer = () => {
  const { locale, t } = useLocale();

  const columns = [
    {
      title: t('header.platform'),
      links: [
        { name: t('nav.programs'), href: "/services" },
        { name: t('nav.learning'), href: "/resources" },
        { name: t('nav.research'), href: "/talent-innovation-hub" },
        { name: t('nav.findPsychologist'), href: "/psychologists" },
      ],
    },
    {
      title: t('header.resources'),
      links: [
        { name: t('nav.blog'), href: "/resources" },
        { name: t('header.selfAssessment'), href: "/get-matched" },
        { name: t('nav.contact'), href: "/contact" },
      ],
    },
    {
      title: t('header.legal'),
      links: [
        { name: t('header.privacyTerms'), href: "/legal" },
        { name: t('header.ethics'), href: "/legal" },
        { name: t('header.telehealthSecurity'), href: "/legal" },
      ],
    },
  ];

  return (
    <footer style={{ background: 'rgba(18,18,18,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Bio */}
          <div className="lg:col-span-2">
            <div className="flex flex-col mb-4">
              <span className="text-u-white font-bold text-xl">U.Psy</span>
              <span className="text-u-gray-300 text-xs">by Mehdi Felji</span>
              <span className="text-u-gray-300 text-sm mt-1.5 leading-[1.4]">
                {t('footer.strapline')}
              </span>
            </div>
            <p className="text-u-gray-300 text-sm mb-6">
              Evidence-based psychology & sport performance.
            </p>

            <div className="space-y-2 text-sm mb-6">
              <p className="text-u-gray-300">
                <span className="text-u-white">{t('footer.email')}:</span> mypersonalpsychologist212@gmail.com
              </p>
              <p className="text-u-gray-300">
                <span className="text-u-white">{t('footer.whatsapp')}:</span>{" "}
                <a href="https://wa.me/212668594699" className="text-u-gold hover:underline" target="_blank" rel="noopener noreferrer">
                  +212 668-594699
                </a>
              </p>
            </div>

            {/* Social */}
            <div className="flex space-x-4">
              <a href="https://www.youtube.com/@UPsy-psychology" target="_blank" rel="noopener noreferrer" className="text-u-gray-300 hover:text-u-white transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
              <a href="https://www.linkedin.com/company/upsy-psychology" target="_blank" rel="noopener noreferrer" className="text-u-gray-300 hover:text-u-white transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="https://www.instagram.com/upsy.psychology" target="_blank" rel="noopener noreferrer" className="text-u-gray-300 hover:text-u-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="https://www.tiktok.com/@upsy.psychology" target="_blank" rel="noopener noreferrer" className="text-u-gray-300 hover:text-u-white transition-colors" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-u-white font-semibold mb-4">{col.title}</h3>
              <div className="space-y-3">
                {col.links.map((link) => (
                  <Link
                    key={link.name}
                    to={addLocalePrefix(link.href, locale)}
                    className="text-u-gray-300 hover:text-u-white text-sm block transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Language */}
        <div className="pt-6 mt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <LanguageSwitcher compact />
        </div>

        {/* Crisis Notice */}
        <div className="pt-6 mt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-u-gray-300 text-xs text-center">
            <strong className="text-u-gold">Important:</strong> {t('footer.crisis')}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-u-gray-300 text-xs text-center">
            © {new Date().getFullYear()} U.Psy by Mehdi Felji. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
