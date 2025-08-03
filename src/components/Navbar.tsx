import { Button } from "@/components/ui/button";
import { Search, Menu, User, Heart } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">NaijaStay</h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center bg-secondary rounded-full border border-neutral-200 shadow-sm hover:shadow-medium transition-all duration-300">
            <div className="px-6 py-2 border-r border-neutral-200">
              <p className="text-sm font-medium text-neutral-600">Where</p>
              <input
                type="text"
                placeholder="Lagos, Abuja"
                className="text-sm bg-transparent border-none outline-none placeholder-neutral-400"
              />
            </div>
            <div className="px-6 py-2 border-r border-neutral-200">
              <p className="text-sm font-medium text-neutral-600">Check in</p>
              <input
                type="text"
                placeholder="Add dates"
                className="text-sm bg-transparent border-none outline-none placeholder-neutral-400"
              />
            </div>
            <div className="px-6 py-2 border-r border-neutral-200">
              <p className="text-sm font-medium text-neutral-600">Check out</p>
              <input
                type="text"
                placeholder="Add dates"
                className="text-sm bg-transparent border-none outline-none placeholder-neutral-400"
              />
            </div>
            <div className="px-6 py-2">
              <p className="text-sm font-medium text-neutral-600">Who</p>
              <input
                type="text"
                placeholder="Add guests"
                className="text-sm bg-transparent border-none outline-none placeholder-neutral-400"
              />
            </div>
            <Button size="sm" className="mr-2 rounded-full">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:flex">
              List your property
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-4 w-4" />
              <User className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="flex items-center bg-secondary rounded-full border border-neutral-200 p-3">
            <Search className="h-5 w-5 text-neutral-400 mr-3" />
            <input
              type="text"
              placeholder="Where are you going?"
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;