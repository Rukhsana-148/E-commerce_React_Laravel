import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

export const StarRating = ({ rating }) => {
  // Round the rating to the nearest half
  const roundedRating = Math.round(rating * 2) / 2; // To handle fractional stars (e.g., 4.5)

  // Create an array for the stars based on the rounded rating
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (index < Math.floor(roundedRating)) {
      return <FaStar key={index} />;
    } else if (index < roundedRating) {
      return <FaStarHalfAlt key={index} />;
    } else {
      return <FaRegStar key={index} />;
    }
  });

  return (
    <div>
      <div className="average-rating">
     
      </div>
      <div style={{ fontSize: '24px'}} className="flex text-green-500">
        {stars.map((star, index) => (
          <span key={index}>{star}</span>
        ))}
      </div>
    </div>
  );
};
