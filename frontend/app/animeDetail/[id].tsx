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
import { Image } from "expo-image";
import Button from "@/components/Button";
import { ScrollView } from "react-native-gesture-handler";
import Rating from "@/components/Rating";

const Detail = () => {
  const { id } = useLocalSearchParams();

  const [detail, setDetail]: any = useState(null);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/anime/detail/${id}`
        );
        if (response.data.success) {
          setDetail(response.data.data);
          setGenre(response.data.data.genres);
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
      <View className="px-3 pb-5">
        <TouchableOpacity
          className="h-12 bg-[#252525] rounded-md justify-center"
          onPress={() => router.push(`../extract/${item.id}`)}
        >
          <Text className="text-white font-medium text-lg px-3">
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-[#171717]">
      <View>
        <Image
          source={{ uri: detail.thumbnail }}
          style={{ width: 400, height: 350, opacity: 0.5 }}
        />
        <View className="absolute pt-72 flex-row px-3">
          <Image
            source={{ uri: detail.thumbnail }}
            style={{
              width: 120,
              height: 170,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#252525",
            }}
          />
          <View className="pl-5">
            <Text
              className="text-xl font-bold text-white"
              style={{ width: 230 }}
            >
              {detail.title}
            </Text>
            <Text
              className="text-md font-medium text-white/70 pt-1 pb-1"
              style={{ width: 230 }}
            >
              {genre.join(" • ")}
            </Text>
            <Rating rating={detail.rating} />
            <View className="pt-1 flex-row gap-5">
              <Button title="Watch" color="#00C853" onPress={() => {}} />
              <Button
                icon={require("../../assets/icons/heart.png")}
                color="#252525"
                onPress={() => {}}
                width={42}
                height={42}
              />
            </View>
          </View>
        </View>
      </View>
      <View className="px-3 pt-32 gap-3">
        <Text className="text-3xl font-bold text-white">Description</Text>
        <Text
          className="text-md font-medium text-white/70"
          numberOfLines={4}
          ellipsizeMode="clip"
        >
          {detail.description}
        </Text>
      </View>
      <View className="pt-10 gap-3">
        <Text className="text-3xl font-bold text-white px-3">Episodes</Text>
        <View className="w-full h-0.5 bg-[#252525]" />
        <FlatList data={detail.episode} renderItem={renderItem} />
      </View>
    </ScrollView>
  );
};

export default Detail;
