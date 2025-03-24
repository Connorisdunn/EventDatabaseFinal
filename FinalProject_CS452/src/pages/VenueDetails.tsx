import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Venue } from '../types/database';
import { MapPin, Users, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  const getNextYearDates = useMemo(() => {
    const dates: Date[] = [];
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }, []);

  useEffect(() => {
    async function loadVenue() {
      try {
        setLoading(true);
        if (!id) {
          navigate('/venues');
          return;
        }

        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .eq('id', id)
          .single();

        if (venueError) throw venueError;

        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('date')
          .eq('venue_id', id);

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
        }

        const bookedDates = new Set(
          bookings?.map(b => new Date(b.date).toDateString()) || []
        );
        
        setAvailableDates(
          getNextYearDates.filter(d => !bookedDates.has(d.toDateString()))
        );
        setVenue(venueData);
      } catch (error) {
        console.error('Error loading venue:', error);
        navigate('/venues');
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id, navigate, getNextYearDates]);

  const handleBooking = async () => {
    if (!selectedDate || !venue) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({ venue_id: venue.id, date: selectedDate.toISOString().split('T')[0] });

      if (error) throw error;

      alert('Booking successful!');
      setSelectedDate(null);
    } catch (error) {
      console.error('Error booking venue:', error);
      alert('Failed to book. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Venue not found</h2>
          <button
            onClick={() => navigate('/venues')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-500 hover:bg-rose-600"
          >
            Return to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/venues')}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600"
      >
        Back to Venues
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img
            src={venue.image_url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
            alt={venue.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{venue.name}</h1>
          <p className="text-lg text-gray-600 mb-6">{venue.description}</p>
          
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-6 w-6 text-rose-500 mr-2" />
              <span>{venue.address}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Users className="h-6 w-6 text-rose-500 mr-2" />
              <span>Capacity: {venue.capacity} guests</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="h-6 w-6 text-rose-500 mr-2" />
              <span>Select a date to book</span>
            </div>
          </div>
          
          <div className="mt-6">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              includeDates={availableDates}
              minDate={new Date()}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
              inline
            />
          </div>
          
          <button 
            onClick={handleBooking}
            disabled={!selectedDate}
            className={`mt-8 w-full px-6 py-3 rounded-md text-lg font-medium ${
              selectedDate
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            {selectedDate ? 'Book This Venue' : 'Select a Date to Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
