import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimeItem from "./AnimeItem";

const AnimeCard = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/v1/anime/order/1/latest"
        );
        if (res.data.success) {
          setAnime(res.data.data);
        }
        setLoading(false);
      } catch (error: any) {
        console.log("error in animeCard: ", error.message);
        setLoading(false);
        setError(error);
      }
    };

    fetchAnime();
  }, [anime]);

  return (
    <View className="pt-3">
      {loading ? (
        <View className="justify-center items-center">
          <ActivityIndicator size={"large"} />
        </View>
      ) : error ? (
        <>
          <Text className="text-red-600 text-2xl">
            There is an error in backend
          </Text>
        </>
      ) : (
        <>
          <FlatList
            data={anime}
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
