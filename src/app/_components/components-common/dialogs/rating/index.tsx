"use client";
import React, { useState } from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Rating({
  onClose = () => {},
  collaborationData,
  handleSubmitRatings = (value: number) => {},
}: {
  collaborationData: any;
  onClose?: () => void;
  handleSubmitRatings: (value: number) => any;
}) {
  const translate = useTranslations();
  const [rating, setRating] = useState(0); // State to store the selected rating
  const [hover, setHover] = useState(0); // State to handle hover effect

  const handleRatingSubmit = () => {
    if (rating > 0) {
      handleSubmitRatings(rating); // Call the submit function with the selected rating
      onClose(); // Close the dialog
    } else {
      alert(translate("Please_select_a_rating")); // Alert if no rating is selected
    }
  };

  return (
    <DialogLayout
      open={true}
      size="!max-w-[300px] sm:!max-w-[300px] w-full overflow-auto m-2"
      title=""
      skipClose={false}
      className="cursor-default"
      titleClassName="my-0 pb-1"
      onClose={() => onClose()}
    >
      <div className=" p-2 text-center">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {translate("Rate_Your_Experience")}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          {translate("Please_rate_your_experience_with_this_collaboration")}
        </p>

        {/* Star Rating */}
        <div className="flex justify-center gap-1 sm:gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl sm:text-3xl ${
                star <= (hover || rating) ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => setRating(star)} // Set the rating on click
              onMouseEnter={() => setHover(star)} // Highlight stars on hover
              onMouseLeave={() => setHover(0)} // Reset hover state
            >
              ★
            </span>
          ))}
        </div>

        {/* Submit Button */}
        <Button
        disabled={rating === 0}
          className="mb-1 px-4 py-2 sm:py-3 border border-primary bg-white text-primary hover:bg-primary hover:text-white rounded-lg text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
          onClick={handleRatingSubmit}
        >
          {translate("Submit")}
        </Button>
      </div>
    </DialogLayout>
  );
}