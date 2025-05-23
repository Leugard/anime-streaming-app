import { View, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import { useFilter } from "@/hooks/useAnime";
import AnimeItem from "./AnimeItem";

const AnimeCard = () => {
  const { data } = useFilter();

  return (
    <View className="">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        renderItem={({ item }) => <AnimeItem item={item} />}
      />
    </View>
  );
};

export default AnimeCard;
