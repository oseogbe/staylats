import { Link, useNavigate } from "react-router-dom";

import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Shield, 
  Home, 
  Building, 
  Users,
  TrendingUp,
  CheckCircle
} from "lucide-react";

import { mockProperties } from "@/data/mockData";

const Index = () => {
  const navigate = useNavigate();

  const featuredProperties = mockProperties.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Property Types Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Explore by Property Type
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Whether you need a short stay or a permanent home, we have the perfect option for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shortlets */}
            <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Shortlets</h3>
                <p className="text-neutral-600 mb-6">
                  Fully furnished apartments and houses for short-term stays. Perfect for business trips, 
                  vacations, and temporary relocations.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <Badge variant="outline">Daily rates</Badge>
                  <Badge variant="outline">Fully furnished</Badge>
                  <Badge variant="outline">Flexible booking</Badge>
                </div>
                  <Button className="w-full" onClick={() => {
                    navigate("/properties?type=shortlet");
                    
                  }}>Explore Shortlets</Button>
              </div>
            </Card>

            {/* Rentals */}
            <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Rentals</h3>
                <p className="text-neutral-600 mb-6">
                  Long-term rental properties for individuals and families looking for a permanent home. 
                  Various options from studios to family houses.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <Badge variant="outline">Monthly rates</Badge>
                  <Badge variant="outline">Long-term</Badge>
                  <Badge variant="outline">All budgets</Badge>
                </div>
                <Button className="w-full" onClick={() => {
                  navigate("/properties?type=rental");
                  
                }}>Browse Rentals</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-neutral-600">
                Hand-picked properties with excellent reviews and great amenities
              </p>
            </div>
            <Link to="/properties">
              <Button variant="outline">View All Properties</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Explore Nigerian Cities
            </h2>
            <p className="text-xl text-neutral-600">
              Currently serving Abuja and Lagos with plans to expand nationwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lagos */}
            <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                <MapPin className="h-16 w-16 text-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Lagos</h3>
                <p className="text-neutral-600 mb-4">
                  Nigeria's commercial capital with vibrant neighborhoods like Victoria Island, 
                  Lekki, Ikeja, and more.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    {mockProperties.filter(p => p.location.includes('Lagos')).length} properties
                  </span>
                  <Button variant="outline" size="sm" onClick={() => {
                    navigate("/properties?city=lagos");
                    
                  }}>Explore Lagos</Button>
                </div>
              </div>
            </Card>

            {/* Abuja */}
            <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                <MapPin className="h-16 w-16 text-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Abuja</h3>
                <p className="text-neutral-600 mb-4">
                  Federal Capital Territory with prestigious areas like Maitama, Katampe Extension, 
                  Guzape and Wuse II.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    {mockProperties.filter(p => p.location.includes('Abuja')).length} properties
                  </span>
                    <Button variant="outline" size="sm" onClick={() => {
                      navigate("/properties?city=abuja");
                      
                    }}>Explore Abuja</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Staylats?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              We make finding and booking properties in Nigeria simple, secure, and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Verified Properties</h3>
              <p className="text-neutral-600">
                All properties are thoroughly verified and inspected to ensure quality and safety.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Trusted Hosts</h3>
              <p className="text-neutral-600">
                Work with verified hosts who are committed to providing excellent hospitality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Easy Booking</h3>
              <p className="text-neutral-600">
                Simple and secure booking process with instant confirmation and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of hosts earning extra income by listing their properties on Staylats
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-primary">
              List Your Property
            </Button>
            <Button variant="secondary" size="lg" className="text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Staylats</h3>
              <p className="text-neutral-400">
                Your trusted platform for finding quality accommodations across Nigeria.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Guests</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="/properties" className="hover:text-white transition-colors">Browse Properties</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety & Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Hosts</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">List Your Property</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Host Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; {new Date().getFullYear()} Staylats. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;