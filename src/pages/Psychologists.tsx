import { useState } from "react";
import { FilterState } from "@/types/psychologist";
import { usePsychologists } from "@/hooks/usePsychologists";
import { PsychologistFilters } from "@/components/psychologists/PsychologistFilters";
import { PsychologistCard } from "@/components/psychologists/PsychologistCard";
import { PsychologistCardSkeleton } from "@/components/psychologists/PsychologistCardSkeleton";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import ScrollReveal from "@/components/ScrollReveal";
import MaroonDivider from "@/components/ui/maroon-divider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Users, Search, Shield, Globe, FlaskConical, SlidersHorizontal, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

const Psychologists = () => {
  const { t } = useLocale();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    specialties: [],
    languages: [],
    therapyApproaches: [],
    city: "",
    online: false,
    inPerson: false,
    gender: "",
    availability: "",
    minPrice: 0,
    maxPrice: 2000,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = usePsychologists({ filters, page, pageSize: 12 });
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  const filteredProfiles = data?.profiles.filter((p) =>
    searchQuery ? p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const activeFilterCount = [
    filters.specialties.length > 0,
    filters.languages.length > 0,
    filters.therapyApproaches.length > 0,
    filters.city !== "",
    filters.online,
    filters.inPerson,
    filters.gender !== "",
    filters.availability !== "",
    filters.minPrice > 0 || filters.maxPrice < 2000,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-neural-bg relative py-20">
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-display leading-tight">
                {t('psychologists.pageTitle')} <span className="text-u-gold">{t('psychologists.pageTitleHighlight')}</span> {t('psychologists.pageTitleEnd')}
              </h1>
              <p className="text-body text-u-gray-200 max-w-xl mx-auto">
                {t('psychologists.pageSubtitle')}
              </p>

              {/* Search Bar */}
              <div className="max-w-lg mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-u-gray-400" />
                  <Input
                    placeholder={t('psychologists.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base"
                  />
                </div>
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button variant="primary" size="lg" asChild>
                  <Link to="/get-matched">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {t('psychologists.takeSelfAssessment')}
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
                  {t('psychologists.browsePsychologists')}
                </Button>
              </div>

              {/* Trust Strip */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                {[
                  { icon: Shield, label: t('psychologists.licensedVerified') },
                  { icon: Globe, label: t('psychologists.onlineInPerson') },
                  { icon: FlaskConical, label: t('hero.evidenceBasedCare') },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-u-gold" />
                    <span className="text-xs text-u-gray-300 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <MaroonDivider />

      {/* Main Content */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          {/* Mobile Filter Trigger */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {t('psychologists.filters')}
                  {activeFilterCount > 0 && (
                    <span className="ml-2 bg-u-gold text-u-charcoal text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-0 overflow-y-auto" style={{ background: 'rgba(26,26,26,0.98)', border: 'none' }}>
                <SheetHeader className="p-6 pb-0">
                  <SheetTitle className="text-u-white">{t('psychologists.filterPsychologists')}</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <PsychologistFilters filters={filters} onFiltersChange={setFilters} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:sticky lg:top-24 h-fit">
              <PsychologistFilters filters={filters} onFiltersChange={setFilters} />
            </aside>

            {/* Psychologists Grid */}
            <div className="space-y-6">
              {/* Results Count */}
              {data && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-u-gray-300">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">
                      {filteredProfiles?.length ?? 0} / {data.total} {t('psychologists.ofPsychologists')}
                    </span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PsychologistCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && (filteredProfiles?.length ?? 0) === 0 && (
                <div className="glass-card p-12 text-center">
                  <Users className="w-12 h-12 text-u-gray-400 mx-auto mb-4" />
                  <h3 className="text-h3 mb-2">{t('psychologists.noResults')}</h3>
                  <p className="text-u-gray-300 mb-6">{t('psychologists.noResultsDesc')}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="primary" asChild>
                      <Link to="/get-matched">{t('psychologists.getMatchedInstead')}</Link>
                    </Button>
                    <Button variant="secondary" onClick={() => {
                      setSearchQuery("");
                      setFilters({ specialties: [], languages: [], therapyApproaches: [], city: "", online: false, inPerson: false, gender: "", availability: "", minPrice: 0, maxPrice: 2000 });
                    }}>
                      {t('psychologists.clearAllFilters')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Cards Grid */}
              {!isLoading && filteredProfiles && filteredProfiles.length > 0 && (
                <>
                  <StaggerContainer staggerDelay={0.08}>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredProfiles.map((psychologist) => (
                        <StaggerItem key={psychologist.id}>
                          <PsychologistCard psychologist={psychologist} />
                        </StaggerItem>
                      ))}
                    </div>
                  </StaggerContainer>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className={`text-u-gray-300 hover:text-u-white ${page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setPage(pageNum)}
                              isActive={page === pageNum}
                              className={`cursor-pointer ${page === pageNum ? "text-u-gold border-u-gold" : "text-u-gray-300 hover:text-u-white"}`}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className={`text-u-gray-300 hover:text-u-white ${page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <MaroonDivider />

      {/* Self-Assessment CTA */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          <div className="glass-card p-10 md:p-14 max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(255,179,0,0.1)', border: '2px solid rgba(255,179,0,0.3)' }}>
                <BarChart3 className="w-8 h-8 text-u-gold" />
              </div>
              <h2 className="text-h2 mb-4">{t('psychologists.notSureTitle')}</h2>
              <p className="text-body text-u-gray-300 max-w-xl mx-auto mb-8">
                {t('psychologists.notSureDesc')}
              </p>
              <Button variant="primary" size="lg" asChild>
                <Link to="/get-matched">{t('psychologists.takeSelfAssessment')}</Link>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Psychologists;