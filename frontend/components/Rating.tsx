import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface RatingProps {
  rating: string;
  size?: number;
  color?: string;
}

const Rating = ({ rating, size = 24, color = "#FF4081" }: RatingProps) => {
  const numericRating = parseFloat(rating);
  const filledStars = Math.floor(numericRating / 2);
  const hasHalfStar = numericRating / 2 - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <View className="flex-row items-center">
      {[...Array(filledStars)].map((_, i) => (
        <MaterialIcons
          key={`filled-${i}`}
          name="star"
          size={size}
          color={color}
        />
      ))}

      {hasHalfStar && (
        <MaterialIcons key="half" name="star-half" size={size} color={color} />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <MaterialIcons
          key={`empty-${i}`}
          name="star-border"
          size={size}
          color={color}
        />
      ))}
    </View>
  );
};

export default Rating;
