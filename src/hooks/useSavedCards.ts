import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface SavedCard {
  id: string;
  card_last_four: string;
  card_brand: string;
  card_holder_name: string;
  expiry_date: string;
  is_default: boolean;
}

interface NewCard {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export function useSavedCards() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchCards();
    }
  }, [user]);

  async function fetchCards() {
    try {
      const { data, error } = await supabase
        .from('saved_cards')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addCard(cardData: NewCard) {
    try {
      const { error } = await supabase
        .from('saved_cards')
        .insert([
          {
            user_id: user?.id,
            card_last_four: cardData.cardNumber.slice(-4),
            card_brand: detectCardBrand(cardData.cardNumber),
            card_holder_name: cardData.cardName,
            expiry_date: cardData.expiryDate,
            is_default: cards.length === 0, // Make first card default
          }
        ]);

      if (error) throw error;
      await fetchCards();
    } catch (error) {
      throw error;
    }
  }

  async function deleteCard(cardId: string) {
    try {
      const { error } = await supabase
        .from('saved_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;
      await fetchCards();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }

  async function setDefaultCard(cardId: string) {
    try {
      // First, set all cards to non-default
      await supabase
        .from('saved_cards')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Then set the selected card as default
      const { error } = await supabase
        .from('saved_cards')
        .update({ is_default: true })
        .eq('id', cardId);

      if (error) throw error;
      await fetchCards();
    } catch (error) {
      console.error('Error setting default card:', error);
    }
  }

  function detectCardBrand(cardNumber: string): string {
    // Simple card brand detection based on first digits
    if (cardNumber.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
    if (/^3[47]/.test(cardNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
    return 'Unknown';
  }

  return {
    cards,
    loading,
    addCard,
    deleteCard,
    setDefaultCard,
  };
}