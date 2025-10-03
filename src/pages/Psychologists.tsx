import { useState } from "react";
import { FilterState } from "@/types/psychologist";
import { usePsychologists } from "@/hooks/usePsychologists";
import { PsychologistFilters } from "@/components/psychologists/PsychologistFilters";
import { PsychologistCard } from "@/components/psychologists/PsychologistCard";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Users, Search } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-surface py-16 border-b border-border">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-h1 font-bold">Find Your Psychologist</h1>
            <p className="text-body text-muted-foreground">
              Browse accredited professionals across Morocco. Filter by specialty, language, location, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Search className="w-4 h-4" />
                  <span>
                    Showing {data.profiles.length} of {data.total} psychologists
                  </span>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading psychologists...</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && data?.profiles.length === 0 && (
                <EmptyState
                  icon={Users}
                  title="No psychologists found"
                  description="Try adjusting your filters to see more results."
                />
              )}

              {/* Cards Grid */}
              {!isLoading && data && data.profiles.length > 0 && (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.profiles.map((psychologist) => (
                      <PsychologistCard key={psychologist.id} psychologist={psychologist} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setPage(pageNum)}
                              isActive={page === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
