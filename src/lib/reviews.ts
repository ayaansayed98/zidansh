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
      // Handle image uploads if any
      let imageUrls: string[] = [];
      
      if (reviewData.images && reviewData.images.length > 0) {
        // For now, we'll store images as base64 strings
        // In production, you'd upload to a storage service
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

      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: reviewData.product_id,
          customer_name: reviewData.customer_name,
          customer_email: reviewData.customer_email,
          rating: reviewData.rating,
          title: reviewData.title,
          description: reviewData.description,
          images: imageUrls,
          verified_purchase: false, // You can implement purchase verification logic
          helpful_count: 0,
          is_approved: true // Set to false if you want to moderate reviews
        })
        .select()
        .single();

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', productId)
        .eq('is_approved', true);

      if (error) throw error;
      
      const reviews = data || [];
      const totalReviews = reviews.length;
      
      if (totalReviews === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;
      
      // Calculate rating distribution
      const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
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
