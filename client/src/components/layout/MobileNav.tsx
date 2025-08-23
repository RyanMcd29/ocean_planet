import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Fish } from "lucide-react";

const MobileNav: React.FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A4D68] text-white shadow-lg z-50">
      <div className="flex justify-center items-end px-4 py-2">
        <div className="flex items-end justify-between w-full max-w-sm">
          <Link href="/community" className={cn(
            "flex flex-col items-center px-2 py-1 flex-1",
            isActive("/community") ? "text-[#05BFDB]" : "text-white"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="text-xs mt-1">Community</span>
          </Link>
          
          <Link href="/species" className={cn(
            "flex flex-col items-center px-2 py-1 flex-1",
            isActive("/species") ? "text-[#05BFDB]" : "text-white"
          )}>
            <Fish className="w-6 h-6" />
            <span className="text-xs mt-1">Species</span>
          </Link>
          
          <Link href="/" className="flex flex-col items-center px-2 -mt-5 flex-1">
            <div className="w-12 h-12 bg-[#EB6440] hover:bg-[#FFAB91] text-white rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                <path d="M2 12h20"></path>
              </svg>
            </div>
            <span className="text-xs mt-1">Explore</span>
          </Link>
          
          <Link href="/learn" className={cn(
            "flex flex-col items-center px-2 py-1 flex-1",
            isActive("/learn") ? "text-[#05BFDB]" : "text-white"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span className="text-xs mt-1">Learn</span>
          </Link>
          
          <Link href="/profile" className={cn(
            "flex flex-col items-center px-2 py-1 flex-1",
            isActive("/profile") ? "text-[#05BFDB]" : "text-white"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
