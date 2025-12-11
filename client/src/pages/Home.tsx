import React, { useMemo, useState } from "react";
import DiveMap from "@/components/map/DiveMap";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSite, fetchDiveSiteSpecies } from "@/lib/api";
import DiveSiteDetails from "@/components/dive-site/DiveSiteDetails";
import { DiveSite } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import MapFilters from "@/components/map/MapFilters";

const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";
const fallbackSpeciesThumb =
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=60";

const normalizeDifficulty = (value?: string | null) => {
  if (!value) return "Intermediate";
  const lower = value.toLowerCase();
  if (lower.includes("beginner")) return "Beginner";
  if (lower.includes("advanced") || lower.includes("expert")) return "Advanced";
  if (lower.includes("intermediate")) return "Intermediate";
  return "Intermediate";
};

type VisibleSiteCardProps = {
  site: DiveSite;
  isActive: boolean;
  onSelect: (site: DiveSite) => void;
};

const VisibleSiteCard: React.FC<VisibleSiteCardProps> = ({ site, isActive, onSelect }) => {
  const { data: speciesList } = useQuery({
    queryKey: [`/api/dive-sites/${site.id}/species`],
    queryFn: () => fetchDiveSiteSpecies(site.id),
  });

  const topSpecies = useMemo(() => speciesList?.slice(0, 5) ?? [], [speciesList]);
  const depthText =
    site.maxDepth ?? site.minDepth ? `${site.minDepth ?? "?"}-${site.maxDepth ?? "?"}m` : "Depth varies";
  const maxDepthDisplay = site.maxDepth ?? site.minDepth ?? null;
  const featuredPhoto = site.mainImage || fallbackImage;
  const difficultyLabel = normalizeDifficulty(site.difficulty);
  const primarySpecies = topSpecies[0];
  const thumbSrc = primarySpecies?.species.imageUrl || featuredPhoto || fallbackSpeciesThumb;

  return (
    <button
      onClick={() => onSelect(site)}
      className={`w-full text-left transition rounded-lg overflow-hidden border h-full min-h-[280px] flex flex-col ${
        isActive ? "border-[#05BFDB] shadow-lg" : "border-slate-100 hover:shadow-md"
      }`}
    >
      <div className="relative h-32 w-full bg-slate-200 overflow-hidden">
        <img src={featuredPhoto} alt={site.name} className="w-full h-full object-cover" />
        <span className="absolute bottom-2 right-2 text-[11px] font-semibold px-2 py-1 rounded-full bg-white/85 text-[#088395] shadow-sm">
          {difficultyLabel}
        </span>
      </div>
      <div className="p-3 space-y-2 bg-white/90 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">{site.name}</p>
            <p className="text-xs text-slate-600">{site.location}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
          <span className="px-2 py-0.5 rounded-full bg-slate-100">{depthText}</span>
          {site.maxVisibility && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100">
              {site.minVisibility ?? site.maxVisibility}-{site.maxVisibility}m vis
            </span>
          )}
          {site.maxTemp && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100">
              {site.minTemp ?? site.maxTemp}-{site.maxTemp}°C
            </span>
          )}
        </div>
        {maxDepthDisplay && (
          <p className="text-[11px] text-slate-700">Max depth: {maxDepthDisplay}m</p>
        )}
        {topSpecies.length > 0 && (
          <div className="text-[11px] text-slate-700 space-y-2">
            <p className="font-semibold text-slate-800">Top species</p>
            <div className="flex items-start gap-2">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={thumbSrc} alt={primarySpecies?.species.commonName || "Species"} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {topSpecies.map((entry) => (
                  <span key={entry.species.id} className="px-2 py-1 bg-slate-100 rounded-full">
                    {entry.species.commonName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1" />
      </div>
    </button>
  );
};

const HomePage: React.FC = () => {
  const [selectedDiveSiteId, setSelectedDiveSiteId] = useState<number | undefined>(undefined);
  const [visibleSites, setVisibleSites] = useState<DiveSite[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  const { data: diveSite, isLoading } = useQuery({
    queryKey: [`/api/dive-sites/${selectedDiveSiteId}`],
    queryFn: () => fetchDiveSite(selectedDiveSiteId!),
    enabled: !!selectedDiveSiteId,
  });
  
  const handleSelectDiveSite = (site: DiveSite) => {
    setSelectedDiveSiteId(site.id);
  };
  
  return (
    <main className="relative flex-1 overflow-hidden bg-slate-900 min-h-[calc(100vh-64px)]">
      <div className="absolute inset-0">
        <DiveMap 
          onSelectDiveSite={handleSelectDiveSite}
          selectedDiveSiteId={selectedDiveSiteId}
          searchQuery={searchQuery}
          filters={filters}
          onVisibleSitesChange={setVisibleSites}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[450] px-4 md:px-8 py-10 md:py-14 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="pointer-events-auto w-full md:w-[360px] lg:w-[420px]">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/60 overflow-hidden max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-180px)] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#05BFDB] to-[#088395] text-white">
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] opacity-80">Sites in view</p>
                <p className="text-lg font-semibold">{visibleSites.length}</p>
              </div>
              <span className="text-xs opacity-90">Within current map bounds</span>
            </div>

            <div className="p-4 border-b border-slate-100">
              <MapFilters
                onSearchChange={(query) => setSearchQuery(query)}
                onFilterChange={(newFilters) => {
                  const cleaned = { ...newFilters };
                  if (cleaned.region === "all") cleaned.region = "";
                  if (cleaned.difficulty === "all") cleaned.difficulty = "";
                  setFilters(cleaned);
                }}
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 p-4 items-stretch auto-rows-[280px]">
              {visibleSites.length ? (
                visibleSites.map((site) => {
                  const isActive = selectedDiveSiteId === site.id;
                  return (
                    <VisibleSiteCard
                      key={site.id}
                      site={site}
                      isActive={isActive}
                      onSelect={handleSelectDiveSite}
                    />
                  );
                })
              ) : (
                <div className="text-sm text-slate-600">
                  Pan or zoom the map to populate the sidebar with sites inside the current view, or refine filters above.
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedDiveSiteId && (
          <div className="pointer-events-auto w-full md:max-w-[520px] md:ml-auto">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-100 max-h-[60vh] md:max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-700">Selected site</p>
                <button
                  onClick={() => setSelectedDiveSiteId(undefined)}
                  className="text-xs font-semibold text-[#088395] hover:text-[#0A4D68] transition"
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    <Skeleton className="w-full h-48" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ) : diveSite ? (
                  <DiveSiteDetails diveSite={diveSite} />
                ) : (
                  <div className="p-6 text-center text-[#EB6440] font-semibold">
                    Failed to load dive site details
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
