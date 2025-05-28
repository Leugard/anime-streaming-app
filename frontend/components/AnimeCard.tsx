import { View, Text, ActivityIndicator } from "react-native";
import AnimeItem from "./AnimeItem";
import { useNewAnime } from "@/hooks/useAnime";
import { FlatList } from "react-native-gesture-handler";

const AnimeCard = () => {
  const { loading, data, error } = useNewAnime();

  return (
    <View className="pt-3">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={"large"} />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-600 text-2xl">{error}</Text>
        </View>
      ) : (
        <View className="items-center">
          <FlatList
            data={data}
            keyExtractor={(item: any) => item.id}
            numColumns={3}
            renderItem={({ item }) => {
              return (
                <View className="px-2 py-2">
                  <AnimeItem item={item} />
                </View>
              );
            }}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default AnimeCard;
