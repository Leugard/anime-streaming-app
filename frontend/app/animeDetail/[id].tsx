import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams, Link } from "expo-router";
import { Image } from "expo-image";
import Button from "@/components/Button";
import { ScrollView } from "react-native-gesture-handler";
import Rating from "@/components/Rating";
import { useDetail } from "@/hooks/useAnime";

const Detail = () => {
  const { id } = useLocalSearchParams();

  const { loading, data, error, refresh } = useDetail(id);

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
      {loading ? (
        <>
          <ActivityIndicator size={"large"} />
        </>
      ) : (
        <View>
          <View>
            <Image
              source={{ uri: data?.thumbnail }}
              style={{ width: 400, height: 350, opacity: 0.5 }}
            />
            <View className="absolute pt-72 flex-row px-3">
              <Image
                source={{ uri: data?.thumbnail }}
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
                  {data?.title}
                </Text>
                <Text
                  className="text-md font-medium text-white/70 pt-1 pb-1"
                  style={{ width: 230 }}
                >
                  {data?.genres?.join(" • ")}
                </Text>
                <Rating rating={data?.rating?.toString() ?? ""} />
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
              {data?.description}
            </Text>
          </View>
          <View className="pt-10 gap-3">
            <Text className="text-3xl font-bold text-white px-3">Episodes</Text>
            <View className="w-full h-0.5 bg-[#252525]" />
            <FlatList data={data?.episode} renderItem={renderItem} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Detail;
