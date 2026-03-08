import { useState } from "react";
import { FilterState } from "@/types/psychologist";
import { usePsychologists } from "@/hooks/usePsychologists";
import { PsychologistFilters } from "@/components/psychologists/PsychologistFilters";
import { PsychologistCard } from "@/components/psychologists/PsychologistCard";
import { PsychologistCardSkeleton } from "@/components/psychologists/PsychologistCardSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import StaggerContainer, { StaggerItem } from "@/components/StaggerContainer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Users, Search, Shield, Globe, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Psychologists = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    specialties: [],
    languages: [],
    city: "",
    online: false,
    inPerson: false,
    minPrice: 0,
    maxPrice: 2000,
  });

  const { data, isLoading } = usePsychologists({ filters, page, pageSize: 12 });
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-neural-bg relative py-20">
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-display leading-tight">
                Find Your <span className="text-u-gold">Psychologist</span>
              </h1>
              <p className="text-body text-u-gray-200 max-w-xl mx-auto">
                Browse accredited professionals across Morocco. Filter by specialty, language, location, and session format.
              </p>

              {/* Trust Strip */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                {[
                  { icon: Shield, label: "Licensed & Verified" },
                  { icon: Globe, label: "Online & In-Person" },
                  { icon: FlaskConical, label: "Evidence-Based" },
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

      {/* Main Content */}
      <section className="section-spacing liquid-bg">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <PsychologistFilters filters={filters} onFiltersChange={setFilters} />
            </aside>

            {/* Psychologists Grid */}
            <div className="space-y-6">
              {/* Results Count */}
              {data && (
                <div className="flex items-center gap-2 text-u-gray-300">
                  <Search className="w-4 h-4" />
                  <span className="text-sm">
                    Showing {data.profiles.length} of {data.total} psychologists
                  </span>
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
              {!isLoading && data?.profiles.length === 0 && (
                <div className="glass-card p-12 text-center">
                  <Users className="w-12 h-12 text-u-gray-400 mx-auto mb-4" />
                  <h3 className="text-h3 mb-2">No psychologists found</h3>
                  <p className="text-u-gray-300 mb-6">Try adjusting your filters to see more results.</p>
                  <Button variant="primary" asChild>
                    <Link to="/get-matched">Get Matched Instead</Link>
                  </Button>
                </div>
              )}

              {/* Cards Grid */}
              {!isLoading && data && data.profiles.length > 0 && (
                <>
                  <StaggerContainer staggerDelay={0.08}>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {data.profiles.map((psychologist) => (
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
    </div>
  );
};

export default Psychologists;
