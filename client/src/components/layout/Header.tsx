import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { WaveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Settings } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

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
          <Link href="/" className="text-xl md:text-2xl font-montserrat font-bold tracking-wider hover:text-[#05BFDB] transition duration-200">
            Ocean Planet
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6 font-montserrat">
          <Link href="/" className={cn(
            "hover:text-[#05BFDB] transition duration-200",
            isActive("/") && "text-[#05BFDB] font-semibold"
          )}>
            Explore
          </Link>
          <Link href="/profile" className={cn(
            "hover:text-[#05BFDB] transition duration-200",
            isActive("/profile") && "text-[#05BFDB]"
          )}>
            My Dives
          </Link>
          <Link href="/community" className={cn(
            "hover:text-[#05BFDB] transition duration-200",
            isActive("/community") && "text-[#05BFDB]"
          )}>
            Community
          </Link>
          <Link href="/species" className={cn(
            "hover:text-[#05BFDB] transition duration-200",
            isActive("/species") && "text-[#05BFDB]"
          )}>
            Species
          </Link>
          <Link href="/learn" className={cn(
            "hover:text-[#05BFDB] transition duration-200",
            isActive("/learn") && "text-[#05BFDB]"
          )}>
            Learn
          </Link>

        </nav>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Link href="/log-dive">
                <Button 
                  className="hidden md:flex bg-[#EB6440] hover:bg-[#FFAB91] text-white" 
                  size="sm"
                >
                  Log Dive
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-9 h-9 bg-[#05BFDB] hover:bg-[#E0F7FA] hover:text-[#0A4D68] cursor-pointer transition duration-200">
                    <AvatarFallback className="text-[#0A4D68] font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      {user?.lastname?.charAt(0)?.toUpperCase() || ''}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.name} {user?.lastname}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-gray-500">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-[#05BFDB] hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#EB6440] hover:bg-[#FFAB91] text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          
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
            <Link href="/" className="text-white hover:text-[#E0F7FA] py-2 font-montserrat">
              Explore
            </Link>
            <Link href="/profile" className="text-white hover:text-[#E0F7FA] py-2 font-montserrat">
              My Dives
            </Link>
            <Link href="/community" className="text-white hover:text-[#E0F7FA] py-2 font-montserrat">
              Community
            </Link>
            <Link href="/learn" className="text-white hover:text-[#E0F7FA] py-2 font-montserrat">
              Learn
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/log-dive">
                  <Button className="w-full bg-[#EB6440] hover:bg-[#FFAB91] text-white">
                    Log Dive
                  </Button>
                </Link>
                <div className="pt-2 border-t border-[#05BFDB]/30">
                  <div className="text-white/70 text-sm mb-2">
                    {user?.name} {user?.lastname}
                  </div>
                  <Button 
                    onClick={logout}
                    variant="ghost" 
                    className="w-full text-white hover:text-[#E0F7FA] hover:bg-white/10 justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-2 border-t border-[#05BFDB]/30">
                <Link href="/login">
                  <Button variant="ghost" className="w-full text-white hover:text-[#E0F7FA] hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-[#EB6440] hover:bg-[#FFAB91] text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
