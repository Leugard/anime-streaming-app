import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import AnimeItem from "./AnimeItem";
import { useNewAnime } from "@/hooks/useAnime";

const AnimeCard = () => {
  const { loading, data, error } = useNewAnime();

  return (
    <View className="pt-3">
      {loading ? (
        <View className="justify-center items-center">
          <ActivityIndicator size={"large"} />
        </View>
      ) : error ? (
        <>
          <Text className="text-red-600 text-2xl">{error}</Text>
        </>
      ) : (
        <>
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
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

export default AnimeCard;
