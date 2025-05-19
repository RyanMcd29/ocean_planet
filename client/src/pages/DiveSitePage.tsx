import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSite } from "@/lib/api";
import DiveSiteDetails from "@/components/dive-site/DiveSiteDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Map } from "lucide-react";

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
    <div className="container mx-auto px-4 py-4 flex-1">
      <div className="flex items-center mb-4">
        <Link href="/">
          <Button variant="outline" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Map
          </Button>
        </Link>
        <h1 className="text-2xl font-montserrat font-bold text-[#0A4D68]">
          {isLoading ? <Skeleton className="h-8 w-48" /> : diveSite?.name}
        </h1>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md">
          <Skeleton className="w-full h-48" />
          <div className="p-4">
            <Skeleton className="h-6 w-2/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg text-center text-red-600">
          <p>Failed to load dive site details. Please try again later.</p>
          <Link href="/">
            <Button variant="link" className="mt-4 text-blue-600">Return to home page</Button>
          </Link>
        </div>
      ) : diveSite ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <DiveSiteDetails diveSite={diveSite} />
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-lg text-center text-yellow-700">
          <p>Dive site not found. It may have been removed or is no longer available.</p>
          <Link href="/">
            <Button variant="link" className="mt-4 text-blue-600">Return to home page</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DiveSitePage;
