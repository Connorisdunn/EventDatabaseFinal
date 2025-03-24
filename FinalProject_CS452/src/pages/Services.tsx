import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Service } from '../types/database';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    async function loadServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(data);
      setLoading(false);
    }

    loadServices();
  }, []);

  const handleLearnMore = (service: Service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-xl text-gray-600">Comprehensive solutions for your perfect day</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">{service.name}</h2>
              <p className="mt-4 text-2xl font-bold text-rose-500">
                ${service.price.toLocaleString()}
              </p>
              <button 
                onClick={() => handleLearnMore(service)}
                className="mt-6 w-full bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">{selectedService.name}</h2>
            <p className="mb-4">{selectedService.description}</p>
            <p className="text-lg font-bold text-gray-900 mb-4">${selectedService.price.toLocaleString()}</p>
            <button
              onClick={closeModal}
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
