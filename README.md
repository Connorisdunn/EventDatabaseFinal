# EventDatabase

## ERD Concept:

#### Venue:
venue_id (Primary Key)

name

address

capacity

#### Event:
event_id (Primary Key)

name

description

start_time

end_time

venue_id (Foreign Key)

#### Customer:
customer_id (Primary Key)

name

email

phone_number

#### Booking:
booking_id (Primary Key)

customer_id (Foreign Key)

event_id (Foreign Key)

booking_date

status (e.g., Confirmed, Pending)

#### Service:
service_id (Primary Key)

name

description

price

#### Event_Service:
Composite table to link events with services
Attributes:

event_id (Foreign Key)

service_id (Foreign Key)

#### Relationships:
A venue can host multiple events.
An event can have multiple bookings and services.
A customer can make multiple bookings.

## ERD Diagram

<img width="840" alt="Screenshot 2025-03-13 at 9 31 01 PM" src="https://github.com/user-attachments/assets/ec7d7174-1c60-44d6-b3d1-0d95074e00e1" />


## Technologies

#### Frontend:
React.js for a user-friendly interface to manage venues, events, and bookings.

#### Backend:
Node.js for API development.

#### Database:
PostgreSQL for persistent data storage.
Redis for caching frequently accessed data like event schedules.

#### Caching Strategy:
Use a cache-aside strategy with Redis to improve read performance for high-demand queries like available venues or event details.

#### Failover Strategy:
Deploy the system across multiple datacenters using a cloud provider like AWS.
Implement automated failover using a load balancer and database replication.

#### Concurrency Management:
Use optimistic locking or database transactions to handle simultaneous bookings for the same event.

#### Scalability:
Horizontal scaling of the backend using container orchestration tools like Kubernetes.
Optimize database queries with indexing on frequently queried fields.

## Initial Goals

#### By March 19:
Finalize ERD design.
Set up the development environment (database, backend framework).

#### By March 26:
Create basic CRUD operations for venues and events.
Implement initial API endpoints.

#### By April 2:
Add customer and booking management functionality.
Integrate Redis caching for high-demand queries.

#### By April 9:
Implement failover strategy and test system resilience.
Optimize database performance for scalability.

#### By April 16:
Complete the project report and presentation.
Record a demo showcasing key features of the system.

