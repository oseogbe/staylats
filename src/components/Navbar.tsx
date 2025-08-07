import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/auth/AuthModal";

import { Search, Menu, User, Heart, HelpCircle, Home, UserPlus, Users, Gift, LogIn } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <h1 className="text-xl sm:text-2xl font-bold text-primary">Staylats</h1>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Link to="/host/phone-registration">
              <Button variant="ghost" className="hidden lg:flex text-sm font-semibold px-3 py-2 rounded-full hover:bg-neutral-100">
                List your property
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-neutral-100">
              <Heart className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 border border-neutral-200 rounded-full px-3 py-2 hover:shadow-md transition-all duration-200">
                  <Menu className="h-4 w-4" />
                  <div className="w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 mt-2 bg-background border border-neutral-200 shadow-lg rounded-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                sideOffset={8}
              >
                <DropdownMenuItem className="p-4 hover:bg-neutral-50 cursor-pointer">
                  <HelpCircle className="h-4 w-4 mr-3 text-neutral-600" />
                  <span className="text-sm font-medium">Help Center</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="p-4 hover:bg-neutral-50 cursor-pointer"
                  onClick={() => navigate("/host/dashboard")}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-3 text-neutral-600" />
                      <div>
                        <p className="text-sm font-medium">Switch to hosting</p>
                        <p className="text-xs text-neutral-500">Manage your properties and earnings.</p>
                      </div>
                    </div>
                    <div className="ml-2 text-lg">🏠</div>
                  </div>
                </DropdownMenuItem>

                <Link to="/host/phone-registration">
                  <DropdownMenuItem className="p-4 hover:bg-neutral-50 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-3 text-neutral-600" />
                        <div>
                          <p className="text-sm font-medium">Become a host</p>
                          <p className="text-xs text-neutral-500">It's easy to start hosting and earn extra income.</p>
                        </div>
                      </div>
                      <div className="ml-2 text-lg">🏠</div>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem className="p-4 hover:bg-neutral-50 cursor-pointer">
                  <UserPlus className="h-4 w-4 mr-3 text-neutral-600" />
                  <span className="text-sm font-medium">Refer a Host</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 hover:bg-neutral-50 cursor-pointer">
                  <Users className="h-4 w-4 mr-3 text-neutral-600" />
                  <span className="text-sm font-medium">Find a co-host</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 hover:bg-neutral-50 cursor-pointer">
                  <Gift className="h-4 w-4 mr-3 text-neutral-600" />
                  <span className="text-sm font-medium">Gift cards</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem 
                  className="p-4 hover:bg-neutral-50 cursor-pointer"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <LogIn className="h-4 w-4 mr-3 text-neutral-600" />
                  <span className="text-sm font-medium">Log in or sign up</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;