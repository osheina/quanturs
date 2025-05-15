
import React from 'react';

const co2Colors: Record<number, string> = {
  1: "bg-green-600",
  2: "bg-green-400",
  3: "bg-yellow-300",
  4: "bg-orange-400",
  5: "bg-red-500",
  6: "bg-gray-700"
};

const co2Labels: Record<number, string> = {
  1: "Ultra low",
  2: "Low",
  3: "Medium",
  4: "Elevated",
  5: "High",
  6: "Very high"
};

interface Co2BadgeProps {
  co2_kg?: number;
  co2_rating?: number;
}

export default function Co2Badge({ co2_kg, co2_rating }: Co2BadgeProps) {
  // Return null if no data or invalid rating
  if (!co2_kg || !co2_rating || co2_rating < 1 || co2_rating > 6) return null;
  
  // Ensure rating is a valid number between 1-6
  const safeRating = Math.min(Math.max(Math.round(co2_rating), 1), 6);
  
  return (
    <div className="flex items-center gap-2 text-xs text-gray-700">
      <div
        className={`rounded-full px-2 py-1 text-white ${co2Colors[safeRating] || 'bg-gray-500'}`}
        title={`~${co2_kg.toFixed(2)} kg CO₂ per visit`}
      >
        CO₂ {safeRating}/6
      </div>
      <span className="text-gray-400">{co2Labels[safeRating] || 'Unknown'}</span>
    </div>
  );
}
