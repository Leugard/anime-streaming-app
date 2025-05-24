import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Text, View } from "react-native";
import Button from "./Button";

const { width } = Dimensions.get("screen");

interface carouselProps {
  item: any;
}

const CarouselItem = ({ item }: carouselProps) => {
  return (
    <View className="bg-gray-900 items-center" style={[{ width: width }]}>
      <View className="w-full opacity-50">
        <Image
          source={{ uri: item.thumbnail }}
          className="opacity-50"
          style={{ width: 400, height: 370 }}
        />
      </View>
      <LinearGradient
        colors={[
          "rgba(255,255,255,0)",
          "rgba(255,255,255,0.1)",
          "#171717",
          "#171717",
        ]}
        className="w-full h-40 absolute top-80"
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View className=" absolute top-[200px] items-center">
        <Text className="text-4xl font-bold text-[#fff] text-center">
          {item.title}
        </Text>
        <Text className="text-xl font-medium text-[#fff]/70 text-center">
          Action • Adventure
        </Text>
        <View className="flex-row pt-2">
          <Image
            source={require("../assets/icons/star.png")}
            className="w-5 h-5"
            style={{ tintColor: "#FF4081", width: 22, height: 22 }}
          />
          <Image
            source={require("../assets/icons/star.png")}
            className="w-5 h-5"
            style={{ tintColor: "#FF4081", width: 22, height: 22 }}
          />
          <Image
            source={require("../assets/icons/star.png")}
            className="w-5 h-5"
            style={{ tintColor: "#FF4081", width: 22, height: 22 }}
          />
          <Image
            source={require("../assets/icons/star.png")}
            className="w-5 h-5"
            style={{ tintColor: "#FF4081", width: 22, height: 22 }}
          />
          <Image
            source={require("../assets/icons/star.png")}
            className="w-5 h-5"
            style={{ tintColor: "#fff", width: 22, height: 22 }}
          />
        </View>
        <View className="pt-5 flex-row gap-3">
          <Button title="Watch" color="#00E676" />
          <Button
            color="#252525"
            icon={require("../assets/icons/heart.png")}
            width={43}
            height={43}
          />
        </View>
      </View>
    </View>
  );
};

export default CarouselItem;
