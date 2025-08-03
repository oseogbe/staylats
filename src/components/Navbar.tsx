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
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">NaijaStay</h1>
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
      </div>
    </nav>
  );
};

export default Navbar;