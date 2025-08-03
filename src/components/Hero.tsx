import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-lagos.jpg";

const Hero = () => {
  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Lagos skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Find Your Perfect Stay in{" "}
          <span className="text-primary">Nigeria</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-neutral-200">
          Discover amazing shortlets and rentals in Lagos and Abuja
        </p>

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-6 shadow-large max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Where
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  placeholder="Lagos, Abuja"
                  className="pl-10 h-12 border-neutral-300 focus:border-primary"
                />
              </div>
            </div>

            {/* Check-in */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Check in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type="date"
                  className="pl-10 h-12 border-neutral-300 focus:border-primary"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Check out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type="date"
                  className="pl-10 h-12 border-neutral-300 focus:border-primary"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  placeholder="Add guests"
                  className="pl-10 h-12 border-neutral-300 focus:border-primary"
                />
              </div>
            </div>
          </div>

          <Button className="w-full md:w-auto mt-6 h-12 px-8 bg-primary hover:bg-primary-hover">
            <Search className="h-5 w-5 mr-2" />
            Search Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;