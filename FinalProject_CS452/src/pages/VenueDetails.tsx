import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Venue } from '../types/database';
import { MapPin, Users, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ImageCarousel } from '../components/ImageCarousel';

export function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [venueImages, setVenueImages] = useState<string[]>([]);
  
  // Booking details state
  const [bookingDetails, setBookingDetails] = useState({
    email: '',
    phone: '',
    services: '',
    additional_notes: '',
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Services state
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase.from('services').select('*');
      if (data) setServices(data);
      if (error) console.error('Error fetching services:', error);
    }
    fetchServices();
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

        // Try to fetch images from venue_images table first
        const { data: imageData, error: imageError } = await supabase
          .from('venue_images')
          .select('image_url')
          .eq('venue_id', id);

        let images: string[] = [];
        
        if (imageError || !imageData || imageData.length === 0) {
          // If images table doesn't exist or no images found, use hardcoded images
          console.log("Using fallback images");
          if (venueData.image_url) {
            images.push(venueData.image_url);
          }
          
          // Add sample images based on venue name
          if (venueData.name === 'Grand Ballroom') {
            images.push('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
            images.push('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          } else if (venueData.name === 'Garden Terrace') {
            images.push('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
            images.push('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          } else if (venueData.name === 'Lakeside Manor') {
            images.push('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
            images.push('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          }
        } else {
          // If images were found in the database, use them
          images = imageData.map(item => item.image_url);
          
          // Add the main venue image as the first image if it exists and isn't already included
          if (venueData.image_url && !images.includes(venueData.image_url)) {
            images.unshift(venueData.image_url);
          }
        }
        
        // Remove duplicates
        setVenueImages(Array.from(new Set(images)));

        // Fetch existing bookings for this venue
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('booking_date')
          .eq('venue_id', id)
          .eq('status', 'confirmed'); // Only check confirmed bookings

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
        }

        const bookedDates = new Set(
          bookings?.map(b => new Date(b.booking_date).toDateString()) || []
        );
        
        // Generate available dates
        const dates: Date[] = [];
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setAvailableDates(
          dates.filter(d => !bookedDates.has(d.toDateString()))
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
  }, [id, navigate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowBookingForm(true);
    setBookingSuccess(false);
  };

  const handleBookingDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !venue) return;

    setIsSubmitting(true);

    try {
      // First, check if the date is still available
      const { data: existingBooking, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('venue_id', venue.id)
        .eq('booking_date', selectedDate.toISOString().split('T')[0])
        .eq('status', 'confirmed')
        .single();

      if (existingBooking) {
        throw new Error('This date is no longer available. Please select another date.');
      }

      // Try to create an actual booking record
      try {
        const { error: bookingError } = await supabase
          .from('bookings')
          .insert({ 
            venue_id: venue.id, 
            booking_date: selectedDate.toISOString().split('T')[0],
            status: 'pending',
            email: bookingDetails.email,
            phone: bookingDetails.phone,
            services: bookingDetails.services,
            additional_notes: bookingDetails.additional_notes,
          });
        
        if (!bookingError) {
          setBookingSuccess(true);
          setSelectedDate(null);
          setShowBookingForm(false);
          setBookingDetails({
            email: '',
            phone: '',
            services: '',
            additional_notes: '',
          });
          return;
        }
      } catch (bookingInsertError) {
        console.log("Couldn't insert into bookings table, using contact_messages as fallback");
      }

      // Fallback: Store the booking in contact_messages table (this will work without auth)
      const { error: contactError } = await supabase.from('contact_messages').insert([
        {
          name: bookingDetails.email.split('@')[0], // Use part of email as name
          email: bookingDetails.email,
          message: `VENUE BOOKING REQUEST:
                   \nVenue: ${venue.name}
                   \nDate: ${selectedDate.toLocaleDateString()}
                   \nPhone: ${bookingDetails.phone}
                   \nServices: ${bookingDetails.services}
                   \nNotes: ${bookingDetails.additional_notes}`
        },
      ]);

      if (contactError) throw contactError;

      setBookingSuccess(true);
      
      // Reset states
      setSelectedDate(null);
      setShowBookingForm(false);
      setBookingDetails({
        email: '',
        phone: '',
        services: '',
        additional_notes: '',
      });
    } catch (error) {
      console.error('Error booking venue:', error);
      alert(error instanceof Error ? error.message : 'Failed to book. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      {bookingSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          <p className="font-medium">Booking request submitted successfully!</p>
          <p>We will contact you soon to confirm your reservation.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          {venueImages.length > 0 ? (
            <ImageCarousel 
              images={venueImages} 
              alt={venue.name} 
            />
          ) : (
            <img
              src={venue.image_url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
              alt={venue.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          )}
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
              onChange={handleDateSelect}
              includeDates={availableDates}
              minDate={new Date()}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
              inline
              showMonthDropdown
              useShortMonthInDropdown
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={2}
              className="date-picker-custom"
            />
          </div>
          
          {showBookingForm && (
            <form onSubmit={handleFinalBooking} className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Booking for {venue.name} on {selectedDate?.toLocaleDateString()}</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={bookingDetails.email}
                  onChange={handleBookingDetailsChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingDetails.phone}
                  onChange={handleBookingDetailsChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Services</label>
                <select
                  name="services"
                  value={bookingDetails.services}
                  onChange={handleBookingDetailsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                >
                  <option value="">Select Services (Optional)</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea
                  name="additional_notes"
                  value={bookingDetails.additional_notes}
                  onChange={handleBookingDetailsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  rows={4}
                  placeholder="Any additional information you'd like to share"
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-rose-500 text-white py-3 rounded-md hover:bg-rose-600 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}