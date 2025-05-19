import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSiteReviews } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, User } from "lucide-react";

interface ReviewsTabProps {
  diveSiteId: number;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ diveSiteId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: [`/api/dive-sites/${diveSiteId}/reviews`],
    queryFn: () => fetchDiveSiteReviews(diveSiteId),
  });
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would normally submit the review via an API call
    console.log("Submitting review:", { rating, reviewText, diveSiteId });
    
    // Reset form
    setRating(0);
    setReviewText("");
  };
  
  const renderStars = (rating: number, interactive = false) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer' : ''}`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      />
    ));
  };
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-4">Reviews</h3>
      
      <div className="mb-6">
        <form onSubmit={handleSubmitReview} className="bg-[#F5F5F5] p-4 rounded-lg">
          <h4 className="text-[#0A4D68] font-semibold mb-3">Share your experience</h4>
          
          <div className="flex items-center mb-3">
            <p className="mr-3 text-sm font-medium">Your rating:</p>
            <div className="flex">
              {renderStars(rating, true)}
            </div>
          </div>
          
          <Textarea 
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="mb-3 min-h-24"
          />
          
          <Button 
            type="submit" 
            className="bg-[#05BFDB] hover:bg-[#088395] text-white"
            disabled={rating === 0 || !reviewText.trim()}
          >
            Submit Review
          </Button>
        </form>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-[#0A4D68] font-semibold">
          {isLoading ? "Loading reviews..." : `${reviews?.length || 0} Reviews`}
        </h4>
        
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-600">
            Failed to load reviews. Please try again later.
          </div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-[#0A4D68] h-10 w-10 rounded-full flex items-center justify-center text-white mr-3">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">User #{review.userId}</p>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <div className="ml-auto text-xs text-[#757575]">
                  {new Date(review.datePosted).toLocaleDateString()}
                </div>
              </div>
              <p className="text-sm text-[#757575]">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="bg-[#F5F5F5] p-4 rounded-lg text-center">
            <p className="text-[#757575]">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
