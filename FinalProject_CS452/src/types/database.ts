export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}