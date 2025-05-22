import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

const Detail = () => {
  const { id } = useLocalSearchParams();

  const [detail, setDetail]: any = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/anime/detail/${id}`
        );
        if (response.data.success) {
          setDetail(response.data.data);
          console.log(response.data.data);
        }
        setLoading(false);
      } catch (error: any) {
        console.error("error fetchDetail: ", error.message);
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} />
      </View>
    );

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity onPress={() => router.push(`../extract/${item.id}`)}>
        <Text>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text>{detail.title}</Text>
      <Text>{detail.totalEpisode}</Text>
      <FlatList
        data={detail.episode}
        keyExtractor={(item: any) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Detail;
