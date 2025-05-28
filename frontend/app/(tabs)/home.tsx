import { ScrollView, Text, View } from "react-native";
import AnimeCard from "@/components/AnimeCard";
import CarouselCard from "@/components/Carousel/CarouselCard";

const Home = () => {
  return (
    <ScrollView className="flex-1 bg-[#171717]">
      <CarouselCard />
      <View className="px-5">
        <Text className="text-3xl font-bold text-white">New Releases</Text>
        <AnimeCard />
      </View>
    </ScrollView>
  );
};

export default Home;
