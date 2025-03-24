import { supabase } from '../lib/supabase';
import type { Venue } from '../types/database';

export async function getVenues(): Promise<Venue[]> {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching venues:', error);
    return [];
  }

  return data;
}