
const co2Colors: { [key: number]: string } = {
  1: "bg-green-600",
  2: "bg-green-400",
  3: "bg-yellow-300",
  4: "bg-orange-400",
  5: "bg-red-500",
  6: "bg-gray-700"
};

const co2Labels: { [key: number]: string } = {
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
  if (co2_kg === undefined || co2_rating === undefined) return null;

  // Ensure co2_rating is a valid key for co2Colors and co2Labels
  const ratingKey = Math.max(1, Math.min(6, Math.round(co2_rating)));

  return (
    <div className="flex items-center gap-2 text-xs text-gray-700 mt-2">
      <div
        className={`rounded-full px-2 py-1 text-white ${co2Colors[ratingKey]}`}
        title={`~${co2_kg.toFixed(2)} kg CO₂ per visit`}
      >
        CO₂ {ratingKey}/6
      </div>
      <span className="text-gray-400">{co2Labels[ratingKey]}</span>
    </div>
  );
}
