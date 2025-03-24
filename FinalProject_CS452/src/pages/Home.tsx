import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div>
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
          className="w-full h-[600px] object-cover"
          alt="Wedding venue"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Create Your Perfect Day
            </h1>
            <p className="mt-4 text-xl text-white">
              Discover our stunning venues for your special moments
            </p>
            <div className="mt-8">
              <Link
                to="/venues"
                className="inline-block bg-rose-500 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-rose-600 transition-colors"
              >
                Explore Venues
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="mt-4 text-lg text-gray-600">
            We make your special day truly unforgettable
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">Beautiful Venues</h3>
            <p className="mt-2 text-base text-gray-500">
              Stunning locations perfect for your special day
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">Customizable Services</h3>
            <p className="mt-2 text-base text-gray-500">
              Tailored packages to match your vision
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">Expert Planning</h3>
            <p className="mt-2 text-base text-gray-500">
              Professional support every step of the way
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}