import { Button } from "@/components/ui/button";
import { Search, Menu, User, Heart } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">NaijaStay</h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center bg-background rounded-full border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 max-w-md mx-4">
            <div className="px-4 py-3 border-r border-neutral-200 min-w-0">
              <p className="text-xs font-semibold text-neutral-700 mb-1">Where</p>
              <input
                type="text"
                placeholder="Lagos, Abuja"
                className="text-sm bg-transparent border-none outline-none placeholder-neutral-400 w-full"
              />
            </div>
            <div className="px-4 py-3 border-r border-neutral-200 min-w-0">
              <p className="text-xs font-semibold text-neutral-700 mb-1">Check in</p>
              <input
                type="text"
                placeholder="Add dates"
                className="text-sm bg-transparent border-none outline-none placeholder-neutral-400 w-full"
              />
            </div>
            <div className="px-4 py-3 border-r border-neutral-200 min-w-0">
              <p className="text-xs font-semibold text-neutral-700 mb-1">Check out</p>
              <input
                type="text"
                placeholder="Add dates"
                className="text-sm bg-transparent border-none outline-none placeholder-neutral-400 w-full"
              />
            </div>
            <div className="px-4 py-3 pr-2 min-w-0">
              <p className="text-xs font-semibold text-neutral-700 mb-1">Who</p>
              <input
                type="text"
                placeholder="Add guests"
                className="text-sm bg-transparent border-none outline-none placeholder-neutral-400 w-full"
              />
            </div>
            <Button size="sm" className="mr-2 rounded-full h-8 w-8 p-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Simplified Search - Medium screens */}
          <div className="hidden md:flex lg:hidden items-center bg-background rounded-full border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 px-4 py-2 mx-4 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-neutral-400 mr-3" />
            <input
              type="text"
              placeholder="Start your search"
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder-neutral-400"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Button variant="ghost" className="hidden lg:flex text-sm font-semibold px-3 py-2 rounded-full hover:bg-neutral-100">
              List your property
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-neutral-100">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 border border-neutral-200 rounded-full px-3 py-2 hover:shadow-md transition-all duration-200">
              <Menu className="h-4 w-4" />
              <div className="w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4 pt-2">
          <div className="flex items-center bg-background rounded-full border border-neutral-200 shadow-sm p-4">
            <Search className="h-5 w-5 text-neutral-400 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full bg-transparent border-none outline-none text-sm font-medium"
              />
              <p className="text-xs text-neutral-500 mt-1">Anywhere • Any week • Add guests</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;