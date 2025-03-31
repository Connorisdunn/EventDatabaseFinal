# Eternal Moments - Wedding Venue Booking Website

A modern, responsive web application for a wedding venue booking service that allows users to browse venues, check availability, request bookings, and contact venue administrators.

For the sake of keeping this Github Repo open to public, I changed the .env file to keep my anon key private, but will include screenshots of entire supabase and website to provide functionality without need of running code. 

VITE_SUPABASE_ANON_KEY= {ENTER ANON KEY}
VITE_SUPABASE_URL= {ENTER URL}

<img width="1440" alt="Screenshot 2025-03-31 at 10 52 14 AM" src="https://github.com/user-attachments/assets/1186a04f-1bec-47e1-8b73-d57ca4f7f5ec" />

## Overview

Eternal Moments is a full-stack web application built with React, TypeScript, and Supabase. The application enables users to:

- Browse available wedding venues
- View detailed information about each venue
- Check venue availability on a calendar
- Request venue bookings for specific dates
- Add additional services to their bookings
- Contact the venue administrators

## Technologies Used

### Frontend
- **React**: Core UI library
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: Page routing and navigation
- **React DatePicker**: Calendar component for date selection
- **Lucide React**: Icon library

### Backend & Database
- **Supabase**: Backend-as-a-Service providing:
  - PostgreSQL database
  - Authentication
  - Row-level security
  - API endpoints


## Data Architecture

The application utilizes a relational database schema with the following tables:

### Primary Tables
- **venues**: Stores venue information (name, address, capacity, description, image)
- **bookings**: Tracks booking requests with venue, date, and status
- **services**: Available add-on services (catering, planning, photography)
- **contact_messages**: Stores user inquiries and messages

### Supporting Tables
- **customers**: User information for booking tracking
- **events**: Event information linked to venues
- **event_services**: Junction table linking events and services
- **venue_images**: Stores multiple images for each venue

## Features

### Venue Browsing
- Grid layout of available venues with images
- Filtering and sorting options

### Venue Details
- Detailed view of each venue with multiple images in a carousel
- Capacity information and detailed descriptions
- Interactive calendar showing available dates

### Booking System
- Date selection via an interactive calendar
- Form for user information and special requests
- Service selection for add-ons
- Booking confirmation flow

### Contact System
- Contact form for general inquiries
- Form validation and confirmation messaging

## Technical Highlights

### Responsive Design
- Fully responsive layout that works on mobile, tablet, and desktop devices
- Consistent user experience across all device sizes

### State Management
- Efficient React state management using hooks
- Centralized data fetching from Supabase

### Image Handling
- Lazy-loaded images for performance
- Smooth image carousel with autoplay and user controls

### Form Handling
- Validation for all user inputs
- Graceful error handling and user feedback

### Security
- Row-level security implemented in Supabase
- Data validation on both client and server

## Project Requirements Addressed

### Data Persistence
- All venue data, booking requests, and contact messages are stored in Supabase PostgreSQL database
- Read operations when browsing venues and checking availability
- Write operations when submitting booking requests and contact forms

### Concurrency Management
- Database constraints prevent double-booking of venues on the same date
- Optimistic UI updates with server validation

### Security Implementation
- Environment variables for Supabase credentials, that only allows admin to access
- Row-level security policies in database
- Input validation to prevent injection attacks

### Deployment & Availability
- Deployed to a cloud hosting service
- Supabase offers high availability and data redundancy

## Future Enhancements

From my research of other wedding venue websites, or even event booking websites, I noticed it was a common theme to not have a personal account. However instead, just have a contact or book through email feature, that allows the admin to go in and respond individually to each request. This could be beneficial as far as keeping timestamps, and in order to make it most similar to other websites and be ready to deploy in the real world, I decided not to implement the account registration. This eliminates the need of several tables in the Supabase database. But if needed, I will keep these tables in Supabase for convenience.

- User authentication for saving favorite venues,tracking booking status, and storing payment method.
- Admin dashboard for venue managers
- Payment integration for booking deposits
- User email notifications for booking confirmations
- Advanced filtering and search functionality
- Analytics dashboard for venue popularity and booking trends


## Project Structure
```
src/
├── components/     # Reusable UI components
├── lib/            # Utility functions and API clients
├── pages/          # Page components
├── services/       # API service functions
├── types/          # TypeScript type definitions
└── App.tsx         # Main application component
```

## Lessons Learned

- The importance of proper database schema design
- Techniques for handling image carousels and date pickers in React
- Strategies for form validation and submission through Supabase API
- Methods for implementing security with Supabase
- Approaches to creating responsive designs with Tailwind CSS

## Screenshots

#### Home Page
<img width="500" alt="Screenshot 2025-03-31 at 11 15 07 AM" src="https://github.com/user-attachments/assets/7ea6012d-acb1-4e4c-918b-98d68051564e" />

#### Footer
<img width="500" alt="Screenshot 2025-03-31 at 11 15 40 AM" src="https://github.com/user-attachments/assets/36b8f8db-3aea-4fcd-a145-e2ec25eceba0" />

#### Venues Page
<img width="500" alt="Screenshot 2025-03-31 at 11 29 03 AM" src="https://github.com/user-attachments/assets/45e71e9d-ebef-4ecf-88bc-134f4ca00d54" />

#### Venue View Details Page
<img width="500" alt="Screenshot 2025-03-31 at 11 16 31 AM" src="https://github.com/user-attachments/assets/70e83297-5d44-4767-b7f6-99639b51d5d8" />
<img width="500" alt="Screenshot 2025-03-31 at 11 17 40 AM" src="https://github.com/user-attachments/assets/f6dc5c03-86e3-43a7-ab4b-6c7bb741d9f9" />
<img width="500" alt="Screenshot 2025-03-31 at 11 18 00 AM" src="https://github.com/user-attachments/assets/465a2441-dd90-4ddd-a48d-a7652ad258b3" />

#### Services Page
<img width="500" alt="Screenshot 2025-03-31 at 11 29 42 AM" src="https://github.com/user-attachments/assets/f2add0a1-7f01-4d9c-9d60-97657475bc08" />
<img width="500" alt="Screenshot 2025-03-31 at 11 18 40 AM" src="https://github.com/user-attachments/assets/f14cd810-85e3-482a-9564-b55f15668414" />

#### Contact Us Page
<img width="500" alt="Screenshot 2025-03-31 at 11 19 21 AM" src="https://github.com/user-attachments/assets/e44c0e1d-2844-429e-97f3-d0d85c96c062" />
<img width="500" alt="Screenshot 2025-03-31 at 11 19 36 AM" src="https://github.com/user-attachments/assets/6d3fbdcd-b996-465d-b728-d81a4e2db2ea" />


#### Supabase Database
<img width="500" alt="Screenshot 2025-03-31 at 11 22 38 AM" src="https://github.com/user-attachments/assets/11436470-2ea7-4071-b266-06f397a0067c" />

#### Supabase Table Examples
<img width="500" alt="Screenshot 2025-03-31 at 11 23 01 AM" src="https://github.com/user-attachments/assets/f9d6d587-43e5-4c63-b734-70428ad93e82" />
<img width="500" alt="Screenshot 2025-03-31 at 11 23 26 AM" src="https://github.com/user-attachments/assets/b1c072ac-e0dd-45e0-9996-58b2e2314504" />
<img width="500" alt="Screenshot 2025-03-31 at 11 23 48 AM" src="https://github.com/user-attachments/assets/c1180ae9-d2f9-4a8b-bafc-76ca12196e87" />
<img width="500" alt="Screenshot 2025-03-31 at 11 24 25 AM" src="https://github.com/user-attachments/assets/8bfc9e2b-b346-4857-be60-144600cefcd5" />

## Contributor
- Connor Dunn
