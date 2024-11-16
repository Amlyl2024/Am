import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ id: user?.id, ...updates });

      if (error) throw error;
      await fetchProfile();
    } catch (err: any) {
      throw err;
    }
  }

  return { profile, loading, error, updateProfile };
}