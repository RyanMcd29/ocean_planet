import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSite } from "@/lib/api";
import DiveSiteDetails from "@/components/dive-site/DiveSiteDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Map, Plus } from "lucide-react";

const DiveSitePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const diveSiteId = parseInt(id);
  
  const { data: diveSite, isLoading, error } = useQuery({
    queryKey: [`/api/dive-sites/${diveSiteId}`],
    queryFn: () => fetchDiveSite(diveSiteId),
    enabled: !isNaN(diveSiteId),
  });
  
  if (isNaN(diveSiteId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg text-center text-red-600">
          <p>Invalid dive site ID. Please check the URL and try again.</p>
          <Link href="/">
            <Button variant="link" className="mt-4 text-blue-600">Return to home page</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <Link href="/">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-3 bg-white/20 border-white/30 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> 
                  Back to Map
                </Button>
              </Link>
              <h1 className="text-xl sm:text-3xl font-montserrat font-bold text-white drop-shadow-md">
                {isLoading ? <Skeleton className="h-8 w-48 bg-white/20" /> : diveSite?.name}
              </h1>
            </div>
            
            {!isLoading && diveSite && (
              <Link href={`/log-dive?site=${diveSite.id}`}>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="h-5 w-5" />
                  Log Dive at {diveSite.name}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl overflow-hidden">
            <Skeleton className="w-full h-64 bg-gradient-to-r from-teal-200 to-blue-300" />
            <div className="p-6">
              <Skeleton className="h-8 w-2/3 mb-6 bg-gradient-to-r from-gray-200 to-gray-300" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Skeleton className="h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200" />
                <Skeleton className="h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200" />
                <Skeleton className="h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-gradient-to-br from-red-100 to-orange-100 border border-red-200 p-8 rounded-3xl text-center shadow-xl">
            <div className="text-red-600 text-lg font-semibold mb-4">
              Failed to load dive site details. Please try again later.
            </div>
            <Link href="/">
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0 hover:from-blue-600 hover:to-teal-600 rounded-2xl px-6 py-3 font-semibold"
              >
                Return to home page
              </Button>
            </Link>
          </div>
        ) : diveSite ? (
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/20">
            <DiveSiteDetails diveSite={diveSite} />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 border border-yellow-200 p-8 rounded-3xl text-center shadow-xl">
            <div className="text-yellow-700 text-lg font-semibold mb-4">
              Dive site not found. It may have been removed or is no longer available.
            </div>
            <Link href="/">
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0 hover:from-blue-600 hover:to-teal-600 rounded-2xl px-6 py-3 font-semibold"
              >
                Return to home page
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiveSitePage;
