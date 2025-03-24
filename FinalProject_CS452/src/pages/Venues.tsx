import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVenues } from '../services/venues';
import type { Venue } from '../types/database';

export function Venues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadVenues() {
      const data = await getVenues();
      setVenues(data);
      setLoading(false);
    }

    loadVenues();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Stunning Venues</h1>
        <p className="text-xl text-gray-600">Discover the perfect setting for your special day</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
            <img
              src={venue.image_url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
              alt={venue.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">{venue.name}</h2>
              <p className="mt-2 text-gray-600">{venue.description || 'A beautiful venue for your special day.'}</p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-rose-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {venue.address}
                </p>
                <p className="text-gray-600 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-rose-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Capacity: {venue.capacity} guests
                </p>
              </div>
              <button 
                onClick={() => navigate(`/venues/${venue.id}`)}
                className="mt-6 w-full bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
