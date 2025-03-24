import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Eternal Moments</span>
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link to="/venues" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Venues
            </Link>
            <Link to="/services" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Services
            </Link>
            <Link to="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}