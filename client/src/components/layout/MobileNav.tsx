import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const MobileNav: React.FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A4D68] text-white shadow-lg z-50">
      <div className="flex justify-around py-2">
        <Link href="/" className={cn(
          "flex flex-col items-center px-3 py-1",
          isActive("/") ? "text-[#05BFDB]" : "text-white"
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-xs mt-1">Explore</span>
        </Link>
        
        <Link href="/learn" className={cn(
          "flex flex-col items-center px-3 py-1",
          isActive("/learn") ? "text-[#05BFDB]" : "text-white"
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span className="text-xs mt-1">Learn</span>
        </Link>
        
        <Link href="/log-dive" className="flex flex-col items-center -mt-5">
          <div className="w-12 h-12 bg-[#EB6440] hover:bg-[#FFAB91] text-white rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span className="text-xs mt-1">Log</span>
        </Link>
        
        <Link href="/community" className={cn(
          "flex flex-col items-center px-3 py-1",
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
        
        <Link href="/profile" className={cn(
          "flex flex-col items-center px-3 py-1",
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
  );
};

export default MobileNav;
