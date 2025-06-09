import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WaveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-[#0A4D68] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-1 shadow-md">
            <img 
              src="/ocean-planet-logo.png" 
              alt="Ocean Planet Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <Link href="/">
            <a className="text-xl md:text-2xl font-montserrat font-bold tracking-wider">
              Ocean Planet
            </a>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6 font-montserrat">
          <Link href="/">
            <a className={cn(
              "hover:text-[#05BFDB] transition duration-200",
              isActive("/") && "text-[#05BFDB] font-semibold"
            )}>
              Explore
            </a>
          </Link>
          <Link href="/profile">
            <a className={cn(
              "hover:text-[#05BFDB] transition duration-200",
              isActive("/profile") && "text-[#05BFDB]"
            )}>
              My Dives
            </a>
          </Link>
          <Link href="/community">
            <a className={cn(
              "hover:text-[#05BFDB] transition duration-200",
              isActive("/community") && "text-[#05BFDB]"
            )}>
              Community
            </a>
          </Link>
          <Link href="/learn">
            <a className={cn(
              "hover:text-[#05BFDB] transition duration-200",
              isActive("/learn") && "text-[#05BFDB]"
            )}>
              Learn
            </a>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button 
            className="hidden md:flex bg-[#EB6440] hover:bg-[#FFAB91] text-white" 
            size="sm"
          >
            Log Dive
          </Button>
          
          <Avatar className="w-9 h-9 bg-[#05BFDB] hover:bg-[#E0F7FA] hover:text-[#0A4D68] cursor-pointer transition duration-200">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          
          <button 
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#088395] py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link href="/">
              <a className="text-white hover:text-[#E0F7FA] py-2 font-montserrat">
                Explore
              </a>
            </Link>
            <Link href="/profile">
              <a className="text-white hover:text-[#E0F7FA] py-2 font-montserrat">
                My Dives
              </a>
            </Link>
            <Link href="/community">
              <a className="text-white hover:text-[#E0F7FA] py-2 font-montserrat">
                Community
              </a>
            </Link>
            <Link href="/learn">
              <a className="text-white hover:text-[#E0F7FA] py-2 font-montserrat">
                Learn
              </a>
            </Link>
            <Button className="w-full bg-[#EB6440] hover:bg-[#FFAB91] text-white">
              Log Dive
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
