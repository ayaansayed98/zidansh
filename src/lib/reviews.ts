import { supabase } from './supabase';

export interface Review {
  id?: string;
  product_id: number;
  customer_name: string;
  customer_email?: string;
  rating: number;
  title: string;
  description: string;
  images?: string[];
  verified_purchase?: boolean;
  helpful_count?: number;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewSubmission {
  product_id: number;
  customer_name: string;
  customer_email?: string;
  rating: number;
  title: string;
  description: string;
  images?: File[];
}

export const reviewsService = {
  // Submit a new review
  async submitReview(reviewData: ReviewSubmission): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('reviewsService: submitReview started (using RAW FETCH)', {
        product_id: reviewData.product_id,
        has_images: reviewData.images?.length
      });

      // Handle image uploads if any
      let imageUrls: string[] = [];
      if (reviewData.images && reviewData.images.length > 0) {
        console.log('reviewsService: processing images...');
        imageUrls = await Promise.all(
          reviewData.images.map(async (file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(file);
            });
          })
        );
      }

      console.log('reviewsService: sending to Supabase via fetch...');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase Config for fetch');
      }

      const url = `${supabaseUrl}/rest/v1/product_reviews`;
      const payload = {
        product_id: reviewData.product_id,
        customer_name: reviewData.customer_name,
        customer_email: reviewData.customer_email,
        rating: reviewData.rating,
        title: reviewData.title,
        description: reviewData.description,
        images: imageUrls.length > 0 ? imageUrls : null,
        verified_purchase: false,
        helpful_count: 0,
        is_approved: true
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('reviewsService: Fetch error', response.status, errorText);
        throw new Error(`Supabase API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('reviewsService: success', data);
      return { success: true };

    } catch (error) {
      console.error('Error submitting review:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit review'
      };
    }
  },

  // Get all reviews for a product
  async getProductReviews(productId: number): Promise<Review[]> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) return [];

      const url = `${supabaseUrl}/rest/v1/product_reviews?product_id=eq.${productId}&is_approved=eq.true&order=created_at.desc&select=*`;

      const response = await fetch(url, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  },

  // Get review statistics for a product
  async getProductReviewStats(productId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  }> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // Default empty stats
      const emptyStats = {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };

      if (!supabaseUrl || !supabaseKey) return emptyStats;

      const url = `${supabaseUrl}/rest/v1/product_reviews?product_id=eq.${productId}&is_approved=eq.true&select=rating`;

      const response = await fetch(url, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch review stats');

      const reviews = await response.json();

      const totalReviews = reviews.length;
      if (totalReviews === 0) return emptyStats;

      const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;

      // Calculate rating distribution
      const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach((review: any) => {
        ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
      });

      return {
        averageRating,
        totalReviews,
        ratingDistribution
      };
    } catch (error) {
      console.error('Error fetching review stats:', error);
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
  },

  // Get review statistics for all products
  async getAllReviewsStats(): Promise<Record<number, { averageRating: number; totalReviews: number }>> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) return {};

      // Select product_id and rating for all approved reviews
      const url = `${supabaseUrl}/rest/v1/product_reviews?is_approved=eq.true&select=product_id,rating`;

      const response = await fetch(url, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch all reviews');

      const reviews = await response.json();

      const stats: Record<number, { sum: number; count: number }> = {};

      reviews.forEach((review: any) => {
        if (!stats[review.product_id]) {
          stats[review.product_id] = { sum: 0, count: 0 };
        }
        stats[review.product_id].sum += review.rating;
        stats[review.product_id].count += 1;
      });

      const result: Record<number, { averageRating: number; totalReviews: number }> = {};

      Object.keys(stats).forEach((productIdStr) => {
        const productId = parseInt(productIdStr);
        const { sum, count } = stats[productId];
        result[productId] = {
          averageRating: count > 0 ? Number((sum / count).toFixed(1)) : 0,
          totalReviews: count
        };
      });

      return result;

    } catch (error) {
      console.error('Error fetching all review stats:', error);
      return {};
    }
  },

  // Mark review as helpful
  async markReviewHelpful(reviewId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_helpful_count', { review_id: reviewId });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      return false;
    }
  },

  // Delete a review (for admin/moderation)
  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  }
};
