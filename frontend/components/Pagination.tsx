import { Dimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width } = Dimensions.get("screen");

const Pagination = ({ items, paginationIndex, scrollX }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        height: 60,
        justifyContent: "center",
      }}
    >
      {items.map((_: any, index: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const pgAnimationStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 20, 8],
            Extrapolation.CLAMP
          );

          return {
            width: dotWidth,
          };
        });
        return (
          <Animated.View
            key={index}
            style={[
              {
                height: 8,
                width: 8,
                marginHorizontal: 2,
                borderRadius: 8,
                backgroundColor: paginationIndex === index ? "#FF4081" : "#fff",
              },
              pgAnimationStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;
