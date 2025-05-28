import { Image, View } from "react-native";

interface RatingProps {
  rating: string;
  size?: number;
  color?: string;
}

const Rating = ({ rating, size = 22, color = "#FF4081" }: RatingProps) => {
  const numericRating = parseFloat(rating);
  const filledStars = Math.floor(numericRating / 2);
  const hasHalfStar = numericRating / 2 - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <View className="flex-row items-center">
      {[...Array(filledStars)].map((_, i) => (
        <Image
          key={i}
          source={require("../assets/icons/star-fill.png")}
          style={{ width: size, height: size, tintColor: color }}
        />
      ))}

      {hasHalfStar && (
        <Image
          source={require("../assets/icons/star.png")}
          style={{ width: size, height: size, tintColor: "#fff" }}
        />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <Image
          key={i}
          source={require("../assets/icons/star.png")}
          style={{ width: size, height: size, tintColor: "#fff" }}
        />
      ))}
    </View>
  );
};

export default Rating;
