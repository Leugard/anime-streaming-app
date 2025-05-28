import { Image } from "expo-image";
import { Dimensions, Text, View } from "react-native";
import Button from "../Button";
import Rating from "../Rating";
import { router } from "expo-router";

const { width } = Dimensions.get("screen");

interface carouselProps {
  item: any;
}

const CarouselItem = ({ item }: carouselProps) => {
  return (
    <View className="flex-1 bg-gray-900 items-center">
      <View className="opacity-50">
        <Image
          source={{ uri: item.thumbnail }}
          className="opacity-50"
          style={{ width: width, height: 370 }}
        />
      </View>
      <View
        className=" absolute top-[200px] items-center justify-between"
        style={{ width: 300, height: 170 }}
      >
        <View className="pt-2 items-center">
          <Text
            className="text-3xl font-bold text-[#fff] text-center"
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {item.title}
          </Text>
          <Text className="text-xl font-medium text-[#fff]/70 text-center">
            {item?.genres?.join(" • ")}
          </Text>
          <View className="flex-row pt-1 gap-2">
            <Rating rating={item.rating} />
            <Text className="text-xl text-white font-bold top-[2px]">
              {item.rating}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-3 pb-1">
          <Button
            width={150}
            height={45}
            title="Watch"
            color="#00E676"
            onPress={() => {
              router.push(`/animeDetail/${item.id}`);
            }}
          />
          <Button
            onPress={() => {}}
            color="#252525"
            icon={require("../../assets/icons/heart.png")}
            width={45}
            height={45}
          />
        </View>
      </View>
    </View>
  );
};

export default CarouselItem;
